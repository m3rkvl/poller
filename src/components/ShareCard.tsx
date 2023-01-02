import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
  TelegramShareButton,
  TelegramIcon,
  RedditShareButton,
  RedditIcon,
  WorkplaceShareButton,
  WorkplaceIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import { QRCodeSVG } from "qrcode.react";
import useCopyToClipboard from "../util/useCopyToClipboard";
import Card from "./ui/Card";
import QrIcon from "./ui/QrIcon";

type shareProps = {
  url: string;
  classes?: string;
};

const ShareCard = ({ url, classes }: shareProps) => {
  const [value, copy] = useCopyToClipboard();
  const linkRef = useRef<HTMLInputElement>(null);
  const [showQr, setShowQr] = useState<any>();
  return (
    <Card
      classes={`${classes} mt-6 flex flex-col justify-center items-center relative after:absolute after:z-[-10] after:inset-0 after:bg-gradient-to-r after:from-teal-500 after:via-blue-500 after:to-purple-500 after:rounded-lg after:translate-y-1 lg:w-full`}
    >
      <div
        onClick={() => setShowQr((prev: any) => false)}
        className={`absolute inset-0 z-30 flex cursor-pointer items-center justify-center bg-gray-800 bg-opacity-90 backdrop-blur-sm transition-all duration-200 ${
          showQr ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <QRCodeSVG
          value={url}
          className={`cursor-pointer drop-shadow-3xl transition-all duration-200 ${
            showQr
              ? "visible scale-[300%] opacity-100"
              : "invisible scale-[0%] opacity-0"
          }`}
          onClick={() => setShowQr((prev: any) => false)}
        />
      </div>

      <h1 className="mb-6 text-xl font-semibold">Share this poll</h1>
      <input
        ref={linkRef}
        value={url}
        readOnly
        onClick={() => {
          linkRef.current!.select();
          copy(url);
          toast.success("Poll link copied.");
        }}
        className="relative mb-4 w-[30rem] cursor-pointer self-center overflow-hidden rounded-lg border border-gray-500 bg-gradient-to-tr from-gray-700 to-gray-600 py-1 text-center transition-all duration-200 after:absolute after:inset-0 after:bg-gradient-to-tr after:from-gray-900 after:to-gray-900 after:opacity-0 after:transition-opacity  after:duration-200 hover:border-gray-400 hover:text-gray-400 hover:after:opacity-25 hxl:w-[24rem] smb2:w-[18rem] xs:w-[14rem]"
      />
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setShowQr((prev: any) => true)}
          className="rounded-lg bg-gray-700 p-[.3rem]"
        >
          <QrIcon />
        </button>
        <EmailShareButton
          url={url}
          title={"Poller"}
          body={"Vote on this poll!"}
        >
          <EmailIcon size={32} borderRadius={16} />
        </EmailShareButton>
        <WhatsappShareButton url={url} title={"Vote on this poll!"}>
          <WhatsappIcon size={32} borderRadius={16} />
        </WhatsappShareButton>
        <TelegramShareButton url={url} title={"Vote on this poll!"}>
          <TelegramIcon size={32} borderRadius={16} />
        </TelegramShareButton>
        <TwitterShareButton
          url={url}
          title={"Vote on this poll!"}
          hashtags={["poller"]}
        >
          <TwitterIcon size={32} borderRadius={16} />
        </TwitterShareButton>
        <FacebookShareButton
          url={url}
          quote={"Vote on this poll!"}
          hashtag={"#poller"}
        >
          <FacebookIcon size={32} borderRadius={16} />
        </FacebookShareButton>
        <RedditShareButton url={url} title={"Vote on this poll!"}>
          <RedditIcon size={32} borderRadius={16} />
        </RedditShareButton>
        <WorkplaceShareButton url={url} quote={"Vote on this poll!"}>
          <WorkplaceIcon size={32} borderRadius={16} />
        </WorkplaceShareButton>
      </div>
    </Card>
  );
};

export default ShareCard;
