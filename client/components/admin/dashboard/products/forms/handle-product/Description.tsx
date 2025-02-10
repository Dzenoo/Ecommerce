'use client';

import React from 'react';
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as ListIcon,
} from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';

import { cn } from '@/lib/utils';
import { CreateProductSchema } from '@/lib/zod/product.zod';

import { Button } from '@/components/ui/buttons/button';

type DescriptionProps = {
  form: UseFormReturn<z.infer<typeof CreateProductSchema>>;
};

const Description: React.FC<DescriptionProps> = ({ form }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      BulletList.configure({
        HTMLAttributes: {
          class: 'tiptap-bulletlist',
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'flex h-52 w-full max-w-full rounded-lg border border-input bg-transparent px-3 py-4 text-sm overflow-auto shadow-sm transition-colors hover:border-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring',
      },
    },
    content: '<p>Type description here</p>',
    onUpdate: ({ editor }) => {
      form.setValue('description', editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  const buttons = [
    {
      id: 1,
      icon: <BoldIcon size={16} />,
      className: editor.isActive('bold') ? 'border-blue-500' : '',
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      id: 2,
      icon: <ItalicIcon size={16} />,
      className: editor.isActive('italic') ? 'border-blue-500' : '',
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      id: 3,
      icon: <UnderlineIcon size={16} />,
      className: editor.isActive('underline') ? 'border-blue-500' : '',
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      id: 4,
      icon: <ListIcon size={16} />,
      className: editor.isActive('bulletList') ? 'border-blue-500' : '',
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {buttons.map((button) => (
          <Button
            key={button.id}
            type="button"
            variant="outline"
            className={cn('rounded p-2', button.className)}
            onClick={button.onClick}
          >
            {button.icon}
          </Button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Description;
