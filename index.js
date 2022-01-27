const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port =process.env.PORT ||5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://sanju:${process.env.DB_PASS}@cluster0.i9wdw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });







async function run() {
  try {
    await client.connect();
      const database = client.db("travelagency");
      const agencyUserCollection = database.collection("agencyUser");
      const agencyproductsCollection = database.collection("agencyproducts");
   

    


    // User add
    app.post('/users',async(req,res)=>{
     const user=req.body
      const result=await agencyUserCollection.insertOne(user)
      console.log(result);
      res.json(result)

    })


    app.put('/users',async(req,res)=>{
      const user=req.body;
      const filter={email:user.email}
      const options={upsert:true}
      const updateDoc={
          $set:user
      }
      const result=await agencyUserCollection.updateOne(filter,updateDoc,options)
      console.log(result);
      res.json(result)
})


app.put('/users/admin',async(req,res)=>{
  const user=req.body;
  const filter={email:user.email}
 
  const updateDoc={
      $set:{role:'admin'}
  }
  const result=await agencyUserCollection.updateOne(filter,updateDoc)
  console.log(result);
  res.json(result)
})







app.get('/users/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await agencyUserCollection.findOne(query);
  let isAdmin = false;
  if (user?.role === 'admin') {
      isAdmin = true;
  }
  res.json({ admin: isAdmin });
})



//user add

//products
app.post('/products',async(req,res)=>{

    const product=req.body;
    const result=await agencyproductsCollection.insertOne(product)
    console.log(result);
    res.json(result)
    
    })


    app.get('/products',async(req,res)=>{

        const cursor=agencyproductsCollection.find({})
          const result=await cursor.toArray()
          
          res.json(result)
      })





      app.get('/product/:key', async (req, res) => {
        
        const cursor=agencyproductsCollection.find({
          "$or":[
            {status:{$regex:req.params.key}},
            
             {Rating:{$regex:req.params.key}},
            // {phone:{$regex:req.params.key}},
            // {age:{$regex:req.params.key}}
          ]
    
        })

        const page=req.query.page;
        const size=parseInt(req.query.size);


        let result;
        const count=await cursor.count()
        if(page){
           result= await cursor.skip(page*size).limit(size).toArray()
        }else{
          result= await cursor.toArray()
        }



         
         
          res.json({
            count,
            result
          })
        
      })







      app.delete('/products/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result=await agencyproductsCollection.deleteOne(query);
        res.json(result)
        
        })




        app.put('/products/:id',async(req,res)=>{
            const id=req.params.id;
            const updarestatus=req.body;
            const filter={_id:ObjectId(id)};
            const options={upsert:true}
            const updateDoc={
              $set: {
                status:updarestatus.status
              },
            }
            const result=await agencyproductsCollection.updateOne(filter,updateDoc,options)
            console.log(result);
            res.json(result)
        })



        app.get('/products/:id',async(req,res)=>{

          const id=req.params.id;
          const query={_id:ObjectId(id)};
          const result=await agencyproductsCollection.findOne(query)
          res.json(result)
          })





          app.put('/products/:id',async(req,res)=>{
            const id=req.params.id;
            console.log(id);
            const updarestatus=req.body;
            console.log(updarestatus);
            const filter={_id:ObjectId(id)};
             const options={upsert:true}
            const updateDoc={
              $set: {
                image:req.body.image,
                title:req.body.title,
                travelerinfo:updarestatus.travelerinfo,
                description:updarestatus.description,
                category:updarestatus.category,
                cost:updarestatus.cost,
                location:updarestatus.location,
                Rating:updarestatus.Rating
              },
            }
            console.log(updateDoc);
            const result=await agencyproductsCollection.updateOne(filter,updateDoc,options)
            console.log(result);
            res.json(result)
        })

// Rating our products






  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
























app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
