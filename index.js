import express from "express"; 
import * as cheerio from "cheerio";
import fetch from "node-fetch"; 
import axios from "axios";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json())

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

async function createconnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("mongo connected")
  return client;
}
const client = await createconnection();

app.get("/", function (request, response) {
    response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.get("/showMobiles", async function (request, response) {
    try{
        const url = "https://www.flipkart.com/search?q=mobiles&sid=tyy%2C4io&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_2_7_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_2_7_na_na_na&as-pos=2&as-type=RECENT&suggestionId=mobiles%7CMobiles&requestId=d6771dbd-3a18-43e2-bbc2-335f6cd04ad9&as-searchtext=mobiles"
        
        const { data } = await axios.get(url);

        const $ = cheerio.load(data);

        const mobileimage = $(".CXW8mj img");
        const mobileTitle = $("._4rR01T");
        const mobileRating = $("._3LWZlK");
        const mobileOfferPrice = $("._30jeq3");
        const mobilePrice = $("._3I9_wc");

        const mobileList = [];

        const category = { image: "", title: "", rating: "", price: 0, offerPrice: 0 };

        mobileimage.each((index, ele) => {
            category.image = $(ele).attr("src");
            mobileList.push(category);
        });

        mobileTitle.each((index,ele)=>{
            category.title = $(ele).text()
            mobileList.push(category)
        })

        mobileRating.each((index,ele)=>{
            category.rating = $(ele).text()
            mobileList.push(category)
        })

        mobilePrice.each((index,ele)=>{
            category.price = $(ele).text()
            mobileList.push(category)
        })

        mobileOfferPrice.each((index,ele)=>{
            category.offerPrice = $(ele).text()
            mobileList.push(category)
        })

        // let itemsList = []
        // for(let i=0; i<10; i++){
        //     itemsList.push(mobileList[i])
        // }
        // console.log(itemsList)

        const result = await client.db("node").collection("mobiles").insertMany(mobileList);
        response.send(result)

    }catch(err){
        console.log(err)
    }
});


// async function scrapData(){
//     try{
//         const url = "https://www.flipkart.com/search?q=mobiles&sid=tyy%2C4io&as=on&as-show=on&otracker=AS_QueryStore_OrganicAutoSuggest_2_7_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_2_7_na_na_na&as-pos=2&as-type=RECENT&suggestionId=mobiles%7CMobiles&requestId=d6771dbd-3a18-43e2-bbc2-335f6cd04ad9&as-searchtext=mobiles"
        
//         const { data } = await axios.get(url);

//         const $ = cheerio.load(data);

//         const mobileimage = $(".CXW8mj img");
//         const mobileTitle = $("._4rR01T");
//         const mobileRating = $("._3LWZlK");
//         const mobileOfferPrice = $("._30jeq3");
//         const mobilePrice = $("._3I9_wc");

//         const mobileList = [];

//         const category = { image: "", title: "", rating: "", price: 0, offerPrice: 0 };

//         mobileimage.each((index, ele) => {
//             category.image = $(ele).attr("src");
//             mobileList.push(category);
//         });

//         mobileTitle.each((index,ele)=>{
//             category.title = $(ele).text()
//             mobileList.push(category)
//         })

//         mobileRating.each((index,ele)=>{
//             category.rating = $(ele).text()
//             mobileList.push(category)
//         })

//         mobilePrice.each((index,ele)=>{
//             category.price = $(ele).text()
//             mobileList.push(category)
//         })

//         mobileOfferPrice.each((index,ele)=>{
//             category.offerPrice = $(ele).text()
//             mobileList.push(category)
//         })

//         let itemsList = []
//         for(let i = 0; i<10; i++){
//             itemsList.push(mobileList[i])
//         }
//         console.log(itemsList)

//     }catch(err){
//         console.log(err)
//     }
// }


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
