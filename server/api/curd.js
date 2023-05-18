const express=require("express")
const router=express.Router()
const multer = require("multer");
const Music=require("../model/song")
const {v4}=require("uuid")

/////////////////////file upload /////////////////////
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "uploads");
    },
    filename: (req, file, callBack) => {
      callBack(null, `${file.originalname}`);
    },
  });


  var upload = multer({ storage: storage });

  /////////////////////////////////////////////////////////////// Add audio/////////////////////////////////////////////////
router.post('/audio?', upload.single("file"),async(req, res,next) => {
   try{
console.log("QUERY?>>>>>>>",req.query.userId)
    const file = req.file;
    // const imagefile = req.image;
    const name=req.query.name
    const desc=req.query.desc
    const userId=req.query.userId

    const data=new Music({
        userId:userId,
        id:v4(),
      name:name,
      image:"image",
      desc:desc,
      song:file.path
    })
    
    const saveData=await data.save()

    console.log("saveData>>>>>>",saveData)
    res.send(saveData)
   }catch(error){
    next(error);
    console.log("ERRORRR>>>>>",error)
   }
 
});


//////////////////////////////////////////////////////////get audio ////////////////////////////////////////////////////

router.get("/get-audio/:userId",async(req,res,next)=>{
    try{
       const userId= req.params.userId
      
        const find=await Music.find({userId:userId})

        res.send(find)

    }catch(error){
       console.log("ERROR>>>>>>",error)
        next(error)
    }
})


/////////////////////////////////////////////////////////update ////////////////////////////////
router.patch("/update-audio?",async(req,res,next)=>{
    try{
        const file = req.file;
   
        const name=req.query.name
        const desc=req.query.desc
        const userId=req.query.userId
        const id=req.query.id

        
        const condition={$and:[{id:id},{userId:userId}]};
        const update={$set:[{name:name},{desc:desc},{song:file.path}]}
        const option={new:true}
        const find=await Music.findOneAndUpdate(condition,update,option)
        res.send(find)
    }catch(error){
        next(error)
        console.log("error>>>>..",error)
    }
})

/////////////////////////////////////////////////////////update ////////////////////////////////
router.delete("/delete-audio/:id",async(req,res,next)=>{
    try{
        const id=req.params.id
        const condition={id:id};
       
        const find=await Music.findOneAndDelete(condition)
        res.send(find)

    }catch(error){
        next(error)
        console.log("error>>>>..",error)
    }
})

module.exports=router