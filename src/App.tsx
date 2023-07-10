import { useEffect, useState } from "react";
import "./App.css";
import { getContract, createPublicClient, http } from "viem";
import { gnosis, mainnet } from "viem/chains";
import { SongABI } from "./abis";

const VideoDisplay: React.FC<{ video: undefined | null | string }> = (p) => {
  if (p.video === undefined) {
    return <div className="lds-dual-ring"></div>;
  } else if (p.video === null) {
    return <h2 style={{ color: "gray" }}> - empty, no song yet -</h2>;
  }
  return (
    <iframe
      width="420"
      height="315"
      src={`https://www.youtube.com/embed/${p.video}`}
    ></iframe>
  );
};

function App() {
  const [video, setVideo] = useState<undefined | null | string>(undefined);

  const fetchVideo = async () => {
    const client = createPublicClient({
      chain: mainnet,
      transport: http("https://gnosischain-rpc.gateway.pokt.network​"),
    });
    const currentSong = await client.readContract({
      address: "0xFAFeF3BEE6b80a7a129949CdA4016DD2fb8B175a",
      abi: SongABI,
      publicClient: client,
      functionName: "song",
    });
    if (currentSong === "") {
      setVideo(null);
    } else {
      setVideo(currentSong);
    }
  };

  useEffect(() => {
    if (video === undefined) {
      void fetchVideo();
    }
  }, [video]);

  return (
    <>
      <h1>
        Tralara DAO -{" "}
        <a
          href="https://gnosisscan.io/address/0x7b438D55C04771F2873664ffA04eF29cCf4Ab02C"
          target="_blank"
        >
          Song of the Day
        </a>
      </h1>
      <VideoDisplay video={video} />
      <div>
        <a href="https://snapshot.org/#/tralara.eth" target="_blank">
          <img
            src="https://cdn.stamp.fyi/space/tralara.eth?s=160&cb=a0b206198f725c87"
            className="logo"
            alt="Tralara DAO"
          />
        </a>
      </div>
    </>
  );
}

export default App;
