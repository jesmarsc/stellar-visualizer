import { useSnapshot } from "valtio";
import clsx from "clsx";

import { uiStore } from "@/stores/ui-store";

import globeSrc from "@/assets/icons/earth-outline.svg";

export const InfoCard = () => {
  const node = useSnapshot(uiStore).selectedNode;

  if (!node) return null;

  return (
    <div className="absolute inset-x-4 top-4 px-4 py-2 rounded bg-black/50 max-w-sm border">
      <div className="flex justify-between gap-4">
        <p className="text-lg font-bold max-w-[20ch] text-ellipsis overflow-hidden whitespace-nowrap">
          {node.name || node.publicKey}
        </p>

        <p className="flex items-center gap-1 font-thin shrink-0">
          <img src={globeSrc} className="size-4" />
          {node.geoData.countryName}
        </p>
      </div>

      <div
        className={clsx(
          "my-2 bg-gradient-to-r h-1 to-transparent",
          node.active ? "from-green-500" : "from-red-500"
        )}
      />

      <InfoCardDetails
        entries={[
          ["Public Key", node.publicKey],
          ["Full Validator", node.isFullValidator.toString()],
          ["IP", `${node.ip}:${node.port}`],
          ["ISP", node.isp],
          ["Version", node.versionStr],
        ]}
      />
    </div>
  );
};

type InfoCardDetailsProps = {
  entries: [string, string][];
} & React.ComponentPropsWithoutRef<"div">;

const InfoCardDetails = ({ entries, ...props }: InfoCardDetailsProps) => {
  return (
    <div {...props} className={clsx(props.className, "")}>
      {entries.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4">
          <p className="font-bold shrink-0">{label}</p>
          <p className="max-w-[20ch] overflow-hidden text-ellipsis font-thin whitespace-nowrap">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
};
