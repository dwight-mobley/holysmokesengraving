'use client';
import {Button, Card, Input} from "@/components/ui"

export default function Home() {
  return (
    <div className="p-3">
      <Card shadow='lg' padding='lg' className='max-w-50 hover:shadow-accent-400'>
        <h1 className="text-brand-400 font-heading">Holy Smokes Engraving</h1>
        <Button onClick={() => alert('clicked')}>Click Me</Button>
        <p className="text-surface-400">Welcome to our website!</p>
        <Input />
      </Card>
    </div>
  );
}
