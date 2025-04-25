import { IconButton, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";

type Props = {
  value: string;
  label: string;
};

const CopyButton: React.FC<Props> = ({ value, label }) => {
  const [tooltipText, setTooltipText] = useState(label);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setTooltipText("Copied !");
    setTimeout(() => {
      setTooltipText(label);
    }, 2000);
  };

  return (
    <Tooltip label={tooltipText} placement="top" closeOnClick={false}>
      <IconButton
        aria-label="Copy signal link"
        icon={<FiCopy />}
        size="sm"
        variant="ghost"
        className="copy-link-button"
        onClick={(e) => {
          e.stopPropagation();
          handleCopyLink(e);
        }}
      />
    </Tooltip>
  );
};

export default CopyButton;
