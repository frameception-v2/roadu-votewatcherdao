import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = "VoteWatcherDAO - Farcaster Frame";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-purple-900">
        {/* Background pattern */}
        <div tw="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20" />
        
        {/* Main content */}
        <div tw="flex flex-col items-center text-center p-8">
          {/* Logo and title */}
          <div tw="flex items-center mb-8">
            <div tw="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mr-4">
              <svg tw="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 tw="text-6xl font-bold text-white">{PROJECT_TITLE}</h1>
          </div>
          
          {/* Description */}
          <h3 tw="text-2xl text-purple-200 max-w-2xl leading-relaxed">
            {PROJECT_DESCRIPTION}
          </h3>
          
          {/* Farcaster branding */}
          <div tw="absolute bottom-8 right-8 flex items-center">
            <span tw="text-sm text-purple-300 mr-2">Powered by</span>
            <svg tw="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span tw="text-sm text-purple-300 ml-1">Farcaster</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
