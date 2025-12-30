"use client";

import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link"; // Import Link for the "Sign up" link

interface LoginDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function LoginDialog({ isOpen, setIsOpen }: LoginDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md rounded-lg p-6">
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Log In
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="absolute top-0 right-0 h-8 w-8"
          >
           
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="loginEmail"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="loginEmail"
              type="email"
              placeholder="Enter your email"
              className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="loginPassword"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="loginPassword"
              type="password"
              placeholder="Enter your password"
              className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
             className="flex-1 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-md px-5 py-2.5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
           className="flex-1 bg-[#6B8E6E] hover:bg-[#6B8E6E]/90 text-white rounded-md px-5 py-2.5"
          >
            Log In
          </Button>
        </DialogFooter>
        <div className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-gray-800 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
