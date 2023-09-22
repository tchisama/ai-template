import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import bg from "@/public/bg.png"
import "./globals.css"
import { Input } from '@/components/ui/input'


const htmlContent = `
<div class="item-card">
  <img src="https://th.bing.com/th/id/R.adae46d53efe04c14e07f6b10bbe47f6?rik=K3rJPH7cRys1Kw&pid=ImgRaw&r=0" alt="Product Image" class="item-image">
  <h3 class="item-title">Product Title</h3>
  <p class="item-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut eleifend augue.</p>
  <div class="item-meta">
    <span class="item-price">$99.99</span>
    <button class="add-to-cart">Add to Cart</button>
  </div>
</div>
<style>
.item-card {
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background:white;
}

.item-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

.item-title {
  font-size: 18px;
  margin: 10px 0;
}

.item-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.item-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-price {
  font-weight: bold;
}

.add-to-cart {
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-to-cart:hover {
  background-color: #45a049;
}
</style>

`




export default function Home() {
  return (
    <div className='min-h-screen  gap-2 bg-white w-full flex flex-col'>
      <div  className='  mt-8 container grid-bg mx-auto flex-1 rounded-xl shadow-inner flex justify-center items-center'>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
      <div className='my-4 p-2 shadow-md border max-w-4xl flex gap-2 w-full mx-auto bg-white rounded-lg'>
        <Input/>
        <Button className='flex gap-2'>Send<Send size={20}/></Button>
      </div>
    </div>
  )
}
