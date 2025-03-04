import { cn } from '@/lib/utils';

type EmptyProps = {
  customStyles?: {
    container?: string;
    icon?: string;
    title?: string;
    description?: string;
  };
  icon: React.ReactNode;
  title: string;
  description: string;
};

const Empty: React.FC<EmptyProps> = ({
  customStyles,
  icon,
  title,
  description,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-1',
        customStyles?.container,
      )}
    >
      <div className={cn('', customStyles?.icon)}>{icon}</div>
      <div>
        <h2 className={cn('text-base font-semibold', customStyles?.title)}>
          {title}
        </h2>
      </div>
      <div>
        <p
          className={cn(
            'text-center text-sm text-muted-foreground',
            customStyles?.description,
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default Empty;
