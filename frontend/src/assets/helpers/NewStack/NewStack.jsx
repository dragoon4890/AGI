import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NewStack = ({ stack, addStackItem, stackId, color }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (stackId) {
      const stackItem = stack.find(item => item.id === stackId);
      if (stackItem) {
        setName(stackItem.name);
        setDescription(stackItem.description);
      }
    }
  }, [stackId, stack]);

  const handleSave = (e) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      const newItem = { id: stackId || Date.now(), name, description };
      addStackItem(newItem);
      setName('');
      setDescription('');
      setOpen(false); // Close the dialog after saving
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" color={color} size="sm">
            {stackId ? 'Edit Stack' : '+ New Stack'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{stackId ? 'Edit Stack' : 'Create New Stack'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-4">
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-10"
              />
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your model"
                className="h-40 pl-[9px] w-full border border-input rounded-lg resize-none"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="default">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewStack;
