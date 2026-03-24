import { sanitizeInput, RICH_TEXT_SANITIZE_OPTIONS, cn } from "../lib/utils";

type HtmlRendererProps = {
  content: string;
  className?: string;
};

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ content, className }) => {
  const sanitized = sanitizeInput(content, RICH_TEXT_SANITIZE_OPTIONS);

  return (
    <div
      className={cn("html-content", className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default HtmlRenderer;
