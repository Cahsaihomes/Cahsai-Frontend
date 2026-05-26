import axios from "axios";
import { multipartPrivateAxios } from "./axiosInstance";

type CloudinaryResourceType = "image" | "video";

interface SignedUploadData {
  cloudName: string;
  apiKey: string;
  folder: string;
  resourceType: CloudinaryResourceType;
  timestamp: number;
  signature: string;
}

interface UploadTask {
  file: File;
  folder: "post_images" | "post_videos";
  resourceType: CloudinaryResourceType;
  kind: "image" | "video";
}

interface UploadResult {
  kind: "image" | "video";
  url: string;
}

const getSignature = async (
  folder: UploadTask["folder"],
  resourceType: CloudinaryResourceType,
  cache?: Map<string, Promise<SignedUploadData>>
): Promise<SignedUploadData> => {
  const cacheKey = `${folder}:${resourceType}`;
  const cached = cache?.get(cacheKey);
  if (cached) return cached;

  const signaturePromise = multipartPrivateAxios
    .post("/uploads/cloudinary-signature", {
      folder,
      resourceType,
    })
    .then((response) => response.data.data);

  cache?.set(cacheKey, signaturePromise);
  return signaturePromise;
};

const uploadSingleFile = async (
  task: UploadTask,
  onFileProgress: (loaded: number) => void,
  signatureCache: Map<string, Promise<SignedUploadData>>
): Promise<UploadResult> => {
  const signed = await getSignature(task.folder, task.resourceType, signatureCache);
  const formData = new FormData();

  formData.append("file", task.file);
  formData.append("api_key", signed.apiKey);
  formData.append("timestamp", String(signed.timestamp));
  formData.append("signature", signed.signature);
  formData.append("folder", signed.folder);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`,
    formData,
    {
      onUploadProgress: (event) => {
        onFileProgress(event.loaded);
      },
    }
  );

  return {
    kind: task.kind,
    url: response.data.secure_url,
  };
};

const runWithConcurrency = async <T,>(
  tasks: UploadTask[],
  limit: number,
  worker: (task: UploadTask, index: number) => Promise<T>
) => {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  const runners = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await worker(tasks[currentIndex], currentIndex);
    }
  });

  await Promise.all(runners);
  return results;
};

export const uploadPostMediaToCloudinary = async (
  images: File[] = [],
  videos: File[] = [],
  onProgress?: (progress: number, status: string) => void
) => {
  const tasks: UploadTask[] = [
    ...images.map((file) => ({
      file,
      folder: "post_images" as const,
      resourceType: "image" as const,
      kind: "image" as const,
    })),
    ...videos.map((file) => ({
      file,
      folder: "post_videos" as const,
      resourceType: "video" as const,
      kind: "video" as const,
    })),
  ];

  if (tasks.length === 0) {
    return { imageUrls: [], videoUrls: [] };
  }

  const loadedByIndex = new Map<number, number>();
  const signatureCache = new Map<string, Promise<SignedUploadData>>();
  const totalBytes = tasks.reduce((sum, task) => sum + task.file.size, 0);

  const updateProgress = () => {
    const loadedBytes = Array.from(loadedByIndex.values()).reduce(
      (sum, loaded) => sum + loaded,
      0
    );
    const uploadPercent = totalBytes > 0 ? loadedBytes / totalBytes : 0;
    const progress = Math.min(90, Math.round(5 + uploadPercent * 85));
    onProgress?.(progress, `Uploading media... ${progress}%`);
  };

  const results = await runWithConcurrency(tasks, 2, (task, index) =>
    uploadSingleFile(task, (loaded) => {
      loadedByIndex.set(index, Math.min(loaded, task.file.size));
      updateProgress();
    }, signatureCache)
  );

  return {
    imageUrls: results
      .filter((result) => result.kind === "image")
      .map((result) => result.url),
    videoUrls: results
      .filter((result) => result.kind === "video")
      .map((result) => result.url),
  };
};
