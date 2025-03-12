const express = require ('express')
const bodyParser = require ('body-parser')
const multer = require('multer')
const cors = require ('cors')
const client = require ('./connection')
const app = express()
const port = 3000
const path = require('path')
 const routes = require('./route');

app.use(express.static(path.join(__dirname,'views')))
app.use(express.static(path.join(__dirname,'public')))


app.use ('/', routes)

app.use(cors())
app.use(bodyParser.json())

app.listen(port, () => {
    console.log (`listen to port http://localhost:${port}`)
})


client.connect(err => {
    if (err){
        console.log(err.message)
    } else {
        console.log('connected')
    }
})


const storage = multer.diskStorage({
    destination: "public/images/",
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});
const upload = multer({storage})

app.get('/siswa', (req, res) => {
    client.query(`select * from siswa`, (err, result) => {
        if(!err) {
            res.send(result.rows);
        }
    })
})

app.get('/siswa/:id', (req,res) => {
  
    client.query(`SELECT * FROM siswa WHERE id = '${req.params.id}'`, (err,result) => {
        if(!err) {
            res.send(result.rows);
        }
    })
})

app.post('/siswa', upload.single("foto"), (req,res) =>{
    const {nama,jenis_kelamin,tanggal,kelas} = req.body
    const imagePath = req.file ? `/images/${req.file.originalname}` : null;
    client.query(`insert into siswa (foto,nama_lengkap, jenis_kelamin, tanggal_daftar, kelas) VALUES ('${imagePath}', '${nama}', '${jenis_kelamin}', '${tanggal}','${kelas}')`, (err,result) =>{
   if (!err){
    res.send("berhasil menginput data")
   } else {
    res.send(err.message)
   }
    })
})
app.put('/siswa/:id', upload.single("foto"), (req, res) => {
    const { nama, jenis_kelamin, tanggal, kelas } = req.body;
    const imagePath = req.file ? `/images/${req.file.originalname}` : null;
    
    const query = `
        UPDATE siswa 
        SET 
            ${imagePath ? `foto = '${imagePath}',` : ""}
            nama_lengkap = '${nama}',
            jenis_kelamin = '${jenis_kelamin}',
            tanggal_daftar = '${tanggal}',
            kelas = '${kelas}'
        WHERE id = '${req.params.id}'`;

    client.query(query, (err, result) => {
        if (!err) {
            res.send("berhasil mengupdate data");
        }
    });
});

app.delete('/siswa/:id', (req,res)=>{
  
    client.query(`delete from siswa WHERE id='${req.params.id}'`, (err,result)=>{
        if (!err) {
            res.send("berhasil menghapus data")
        } else {
            res.send(err.message)
        }
    })
})

