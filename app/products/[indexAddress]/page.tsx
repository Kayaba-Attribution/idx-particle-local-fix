// app/products/[indexAddress]/page.tsx
"use client";

import React from "react";
import IndexChart from "../../../src/components/analytics/IndexChart";
import IndexDetails from "../../../src/components/analytics/IndexDetails";
import IndexDistribution from "../../../src/components/analytics/IndexDistribution";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  usePublicClient,
  useWallets,
  useAccount,
} from "@particle-network/connectkit";

// Types
type DataPoint = {
  timestamp: string;
  price: string;
};

type PriceData = {
  "24h-ts": DataPoint[];
  "7d-ts": DataPoint[];
  "1m-ts": DataPoint[];
  "3m-ts": DataPoint[];
  "6m-ts": DataPoint[];
};

type TokenData = {
  id: string;
  name: string;
  symbol: string;
  address: string;
  "deploy-timestamp": string;
  "price-data": DataSection;
  "token-data": {
    supply: string;
    mcap: string;
    distribution: Distribution[];
  };
};

type DataSection = {
  [key: string]: string;
};

type Distribution = {
  symbol: string;
  address: string;
  portion: string;
};

// Safe Components with Validation
const SafeIndexChart: React.FC<{ data: DataPoint[] }> = ({ data }) => {
  return (
    <>
      {data && data.length > 0 ? (
        <IndexChart data={data} />
      ) : (
        <p className="text-center text-gray-500">Loading chart data...</p>
      )}
    </>
  );
};

const SafeIndexDetails: React.FC<{ tokenData: TokenData }> = ({ tokenData }) => {
  return (
    <>
      {tokenData ? (
        <IndexDetails tokenData={tokenData} />
      ) : (
        <p className="text-center text-gray-500">Loading token details...</p>
      )}
    </>
  );
};

const SafeIndexDistribution: React.FC<{ tokenData: TokenData }> = ({ tokenData }) => {
  return (
    <>
      {tokenData ? (
        <IndexDistribution tokenData={tokenData} />
      ) : (
        <p className="text-center text-gray-500">Loading distribution data...</p>
      )}
    </>
  );
};

// ProductInfo Component
function ProductInfo() {
  const { chain, address, isConnected } = useAccount();
  const [primaryWallet] = useWallets();
  const { indexAddress } = useParams<{ indexAddress: `0x${string}` }>();
  const [chartData, setChartData] = React.useState<DataPoint[]>([]);
  const [priceData, setPriceData] = React.useState<PriceData | null>(null);
  const [tokenData, setTokenData] = React.useState<TokenData | null>(null);
  const [selectedRange, setSelectedRange] = React.useState<
    "24h-ts" | "7d-ts" | "1m-ts" | "3m-ts" | "6m-ts"
  >("24h-ts");

  const timeRanges = ["24h-ts", "7d-ts", "1m-ts", "3m-ts", "6m-ts"] as const;

  React.useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("/src/data/advanced-info.json");
        if (!response.ok) throw new Error('Failed to fetch chart data');
        const json = await response.json();
        setPriceData(json["price-data"]);
        setChartData(json["price-data"]["24h-ts"]);
      } catch (error) {
        console.error("Failed to load chart data:", error);
      }
    };

    const fetchTokenData = async () => {
      if (!indexAddress) return;

      try {
        const response = await fetch(
          `http://ec2-54-174-164-111.compute-1.amazonaws.com/api/token/${indexAddress}`
        );
        if (!response.ok) throw new Error('Failed to fetch token data');
        const json = await response.json();
        setTokenData(json);
      } catch (error) {
        console.error("Failed to load token data:", error);
      }
    };

    fetchChartData();
    fetchTokenData();
  }, [indexAddress]);

  React.useEffect(() => {
    if (priceData && priceData[selectedRange]) {
      setChartData(priceData[selectedRange]);
    }
  }, [selectedRange, priceData]);

  if (!indexAddress) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-16 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-12 space-y-8 md:space-y-10 max-w-screen-xl w-full">
        <h2 className="text-[#364647] max-w-3xl text-center text-3xl font-bold md:text-4xl lg:text-5xl lg:leading-tight">
          Knowledge is leverage. <br /> Leverage maximizes returns.
        </h2>
        <h3 className="text-[#859393] max-w-lg text-center text-sm font-medium md:text-base">
          Gain deep insights into index metrics and trends to leverage smarter,
          data-driven decisions.
        </h3>
        {indexAddress && (
          <Link
            href={`/products/${indexAddress}/trade`}
            className="bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-11 py-3"
          >
            Trade Now
          </Link>
        )}
      </div>

      <div className="w-full max-w-6xl mb-8">
        <div className="w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            {tokenData?.symbol || "Loading..."}
          </h2>

          <div className="flex justify-center space-x-2 mb-4">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedRange === range
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
              >
                {range.toUpperCase().replace("-TS", "")}
              </button>
            ))}
          </div>

          <SafeIndexChart data={chartData} />
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <SafeIndexDetails tokenData={tokenData!} />
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg h-auto">
          <SafeIndexDistribution tokenData={tokenData!} />
        </div>
      </div>
    </div>
  );
}

// Page wrapper component
export default function Page() {
  const params = useParams();
  
  if (!params?.indexAddress) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return <ProductInfo />;
}