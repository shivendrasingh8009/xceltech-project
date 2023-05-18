import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,FormControl} from '@angular/forms';

declare const $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  // files: { name: string; url: string; desc:string,image:string}[]=[];
  songFile: any;
  imageFile: any;
  userId:any;
  files:any=[]
  
  

  addForm!: FormGroup<any>;
  registerForm!: FormGroup<any>;
  patch: any;
 

  constructor(private formBuilder: FormBuilder, private http:HttpClient) {
    if(sessionStorage.getItem("userId")!=null){
      this. userId=sessionStorage.getItem("userId")
    }else{
      this.userId="0"
    }
   
  }

 

 
  title = 'Song.mp3';
  dataValue:any="0";
ngOnInit(){
  this.getAudio()
  this.addForm = this.formBuilder.group({
    
    name:['', [Validators.required]],
    desc:['', [Validators.required]],
  
  });
  if(sessionStorage.getItem("dataValue")!=null){
    this.dataValue=sessionStorage.getItem("dataValue")
    
  }
  console.log(sessionStorage.getItem("dataValue"))
 
 let userId=sessionStorage.getItem("userId")
 let uaer=sessionStorage.getItem("user")

  
 
 
}
////////////////////////////select file ////////////////////////
selectFile(event:any){
 
    const file=event.target.files[0]
    this.songFile=file
    // console.log("this.songFile>>>>>>",this.songFile)
  

}
////////////////////////////select Image ////////////////////////
selectImage(event:any){
 
    const image=event.target.files[0]
    this.imageFile=image
    // console.log("this.songFile>>>>>>",this.songFile)
  

}
addsong(){
  const formData=new FormData();
  formData.append('file',this.songFile)
  // formData.append('image',this.songFile)

  if(this.addForm.valid){
    let params = new HttpParams();
    params = params.set("name",this.addForm.value.name);
    params = params.set("desc",this.addForm.value.desc);
    params = params.set("userId",this.userId);
    this.http.post("http://localhost:3000/test/audio?"+params,formData).subscribe((res:any)=>{
console.log("RESSSSSSSS>>>>>",res)
let path=res.song
console.log("RESSSSSSSS>>>>>",path)
this.getAudio()


  })
   

  }else{
    console.log("Unvalid",this.addForm )
  }

}


//////////////////////////////////////////////////////////////////////////
 audio=new Audio()

fileplay(file:any){
 
  let url=file.song

  
 
  this.audio.src= "http://localhost:3000/"+url
  this.audio.load();
  this.audio.play()

}
//play //////////////////////////////////////////
play(){
  this.audio.play()
  
}

//////////////////////pause //////////////////////////
pause(){
  this.audio.pause()
  
}




getAudio(){
  // offset, limit, sort_col, sort_order
  // let params = new HttpParams();
  //   params = params.set("offset", offset);
  //   params = params.set("limit", limit);
  //   params = params.set("sort_col", sort_col);
  //   params = params.set("sort_order", sort_order);
  this.http.get("http://localhost:3000/test/get-audio"+"/"+this.userId).subscribe((res:any)=>{
    console.log("GET SONG>>>>>>",res)
    this.files=res
    console.log("FILES>>>>>",this.files)
 
  })
}

deleteSong(data:any){
  this.http.delete("http://localhost:3000/test/delete-audio"+"/"+data.id).subscribe((res:any)=>{
    this.getAudio()

  })

}
edit(id:any){
  this.files.filter((d:any)=>{
    if(id==d.id){
      this.addForm.patchValue({
        name:d.name,
        desc:d.desc
        
      })
    }
  })

}


updateSong(data:any){
  let id=data.id
  this.edit(id)
  const formData=new FormData();
  formData.append('file',this.songFile)
  // formData.append('image',this.songFile)

  if(this.addForm.valid){
    let params = new HttpParams();
    params = params.set("name",this.addForm.value.name);
    params = params.set("desc",this.addForm.value.desc);
    params = params.set("id",data.id);
    params = params.set("userId",this.userId);
  
  this.http.patch("http://localhost:3000/test/delete-audio"+params,formData).subscribe((res:any)=>{
    console.log("GET SONG>>>>>>",res)
    this.getAudio()

  })

}

}
}

    


