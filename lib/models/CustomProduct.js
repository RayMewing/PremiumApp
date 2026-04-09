import mongoose from 'mongoose'
const schema = new mongoose.Schema({
  name: { type:String, required:true },
  imgUrl: { type:String, default:'' },
  email: { type:String, required:true },
  password: { type:String, required:true },
  note: { type:String, default:'' },
  priceM: { type:Number, default:0 },
  priceO: { type:Number, default:0 },
  isActive: { type:Boolean, default:true },
}, { timestamps:true })
export const CustomProduct = mongoose.models.CustomProduct || mongoose.model('CustomProduct', schema)
