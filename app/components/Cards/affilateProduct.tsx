import Image from "next/image";
import Link from "next/link";


type Props = {
  productName: string;
  productPrice: number;
  Imageurl: string;
  linkurl: string;
  merchantName: string;
  productCurrency: string;
  keywords?: string[];
  key: string
}
const AffilateProduct = (props: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md ">
      <Image alt="Affiliate Product" src={props.Imageurl} width={100} height={100} />
      <div className="p-4">
        {props.keywords?.map((keyword) => (<span key={keyword} className="text-xs text-black rounded-sm py-1 px-2 cursor-pointer transition-all  bg-gray-200 hover:bg-green-400 mr-1">{keyword}</span>
        ))}
        <h2 className="text-lg font-semibold mt-1">{props.productName}</h2>
        <p className="text-sm text-gray-500 mt-1">Sold by: {props.merchantName}</p>
        <p className="text-green-600 font-bold mt-1">{props.productCurrency}{props.productPrice}</p>
        <Link className="w-full rounded-md shadow-sm flex justify-center py-4 bg-green-600 text-white" href={props.linkurl}>Link</Link>
      </div>
    </div>
  )
};

export default AffilateProduct;