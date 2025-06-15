// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const Form = require('./models/forms');
const morgan = require('morgan');
const { title } = require('process');
const Ajv = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats');
const schemaConverter = require('./schemaConverter');
const Excel = require('exceljs');
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/json') {
      return cb(new Error('Only JSON files are allowed'));
    }
    cb(null, true);
  }
})
const ajv= new Ajv({allErrors:true,strictSchema:true});
addFormats(ajv);
const validateSchema=ajv.compile(ajv.getSchema("https://json-schema.org/draft/2020-12/schema").schema);
const db = "mongodb+srv://sampleacc:test1234@nodetutorial.bpw6ha8.mongodb.net/dynamic_forms?retryWrites=true&w=majority&appName=nodetutorial";

const app = express();
const PORT = 3000;

mongoose.connect(db).then((result)=>{
  app.listen(3000,()=>console.log("Listening on Port 3000!"));
}).catch((err)=>console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));

app.get('/',(req,res)=>{
    Form.find().sort({createdAt:-1})
    .then((result)=>{
      res.render('index',{forms:result});
    })
    .catch((err)=>{
      console.log(err);
    });
});

app.get('/create',(req,res)=>{
    res.render('form');
});

app.post('/check', upload.single('jsonFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const json = JSON.parse(req.file.buffer.toString());
    console.log(json);
    const form = new Form({title:json.title,formSchema:json,files:[]});
    form.save().then((result)=>{
    console.log(result);
    res.redirect('/');
  })
  .catch((err)=>{
    console.log(err);
  });
  } catch (err) {
    console.error("Invalid JSON:", err.message);
    res.status(400).send('Invalid JSON');
  }
});

app.get('/forms/:id',(req,res)=>{
  const data = req.query;
  console.log(data);
  Form.findById(req.params.id)
  .then((result)=>{
    res.render('formDisplay',{form:result,data:data});
  })
  .catch((err)=>{
    console.log(err);
  });
});

app.post('/submit/:id',(req,res)=>{
  console.log(req.body);
  res.redirect("/forms/"+req.params.id);
  Form.findByIdAndUpdate(req.params.id,
    {
      $push :{files : req.body}
    },
    {new : true}
  ).then(updatedForm => {
    console.log('Submission saved:', Form.findById(req.params.id));
  })
  .catch(err => {
    console.error('Error saving submission:', err);
  });
});

app.get("/export/:id",(req,res)=>{
  try {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Submissions');
  Form.findById(req.params.id)
  .then( async (result)=>{
    const files=result.files;
    worksheet.columns = Object.keys(files[0]||{}).map(key => ({ header: key, key }));
    files.forEach(item => worksheet.addRow(item));
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="submissions.xlsx"'
    );

    await workbook.xlsx.write(res); // Stream directly to response
  })
  .catch((err)=>{
    console.log(err);
    res.send(`<script>alert("No records found!"); window.location.href = "/";</script>`);
  });
} catch(err){
  console.log(err);
}
});

