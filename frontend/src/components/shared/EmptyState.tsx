import { Inbox } from 'lucide-react';

export default function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon || <Inbox className="w-16 h-16 text-gray-300 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-2">{description}</p>}
    </div>
  );
}
