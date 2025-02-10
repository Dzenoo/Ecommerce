import { TooltipWrapper } from '@/components/ui/info/tooltip-wrapper';

export const renderIconText = (
  {
    id,
    icon,
    text,
    tooltip,
  }: {
    id: number;
    icon: React.ReactNode;
    text: string;
    tooltip?: string;
  },
  customStyles?: {
    div?: string;
    icon?: string;
    p?: string;
  },
) => {
  const content = (
    <div key={id} className={`flex items-center gap-2 ${customStyles?.div}`}>
      <span className={`${customStyles?.icon}`}>{icon}</span>
      <p className={`font-light text-muted-foreground ${customStyles?.p}`}>
        {text}
      </p>
    </div>
  );

  return tooltip ? (
    <TooltipWrapper tooltip={tooltip}>{content}</TooltipWrapper>
  ) : (
    content
  );
};
