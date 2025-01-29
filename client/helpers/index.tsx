export const renderIconText = (
  {
    id,
    icon,
    text,
  }: {
    id: number;
    icon: React.ReactNode;
    text: string;
  },
  customStyles?: {
    div?: string;
    icon?: string;
    p?: string;
  },
) => {
  return (
    <div key={id} className={`flex items-center gap-2 ${customStyles?.div}`}>
      <span className={`${customStyles?.icon}`}>{icon}</span>
      <p className={`text-muted-foreground font-light ${customStyles?.p}`}>
        {text}
      </p>
    </div>
  );
};
