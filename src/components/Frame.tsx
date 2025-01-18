"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { config } from "~/components/providers/WagmiProvider";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { getVotingPower, getActiveProposals, checkVoteEligibility } from "~/lib/dao";

function VoteCard({ proposal, votingPower, isEligible }: { 
  proposal: any,
  votingPower: number,
  isEligible: boolean 
}) {
  return (
    <Card className="border-neutral-200 bg-white mb-4">
      <CardHeader>
        <CardTitle className="text-neutral-900">{proposal.title}</CardTitle>
        <CardDescription className="text-neutral-600">
          Ends: {new Date(proposal.endDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-neutral-800">
        <div className="space-y-2">
          <p>Your Voting Power: {votingPower}</p>
          <p>Status: {isEligible ? (
            <span className="text-green-600">Eligible to vote</span>
          ) : (
            <span className="text-red-600">Not eligible</span>
          )}</p>
          <PurpleButton 
            onClick={() => window.open(proposal.link, '_blank')}
            disabled={!isEligible}
          >
            View Proposal
          </PurpleButton>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [added, setAdded] = useState(false);
  const [addFrameResult, setAddFrameResult] = useState("");
  
  // DAO Voting State
  const { address } = useAccount();
  const [votingPower, setVotingPower] = useState(0);
  const [proposals, setProposals] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<boolean[]>([]);

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // Load DAO data if wallet is connected
      if (address) {
        try {
          const power = await getVotingPower(address);
          setVotingPower(power);
          
          const activeProposals = await getActiveProposals();
          setProposals(activeProposals);
          
          const eligibilityChecks = await Promise.all(
            activeProposals.map(p => checkVoteEligibility(address, p.id))
          );
          setEligibility(eligibilityChecks);
          
          // Notify user if eligible for any votes
          if (eligibilityChecks.some(e => e)) {
            sdk.actions.notify({
              title: "Vote Alert",
              body: "You're eligible to vote on active proposals!",
              icon: "https://votewatcherdao.xyz/icon.png"
            });
          }
        } catch (error) {
          console.error("Error loading DAO data:", error);
        }
      }

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">{title}</h1>
        
        {address ? (
          <>
            <div className="mb-4">
              <Label>Your Voting Power</Label>
              <div className="text-xl font-bold">{votingPower}</div>
            </div>
            
            {proposals.length > 0 ? (
              proposals.map((proposal, index) => (
                <VoteCard
                  key={proposal.id}
                  proposal={proposal}
                  votingPower={votingPower}
                  isEligible={eligibility[index]}
                />
              ))
            ) : (
              <Card className="border-neutral-200 bg-white">
                <CardContent className="p-4 text-neutral-800">
                  No active proposals at this time
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-neutral-200 bg-white">
            <CardContent className="p-4 text-neutral-800">
              Connect your wallet to view voting information
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
