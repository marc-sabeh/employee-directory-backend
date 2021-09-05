const express = require('express');
const router = express.Router();
const DepartmentModel = require('../models/department');
const checkAuth = require('../middleware/check-auth');


/* GET all departments */
router.get('/', function(req, res, next) {
    DepartmentModel.find()
    .exec()
    .then(department=>{
        const response ={
            count: department.length,
            departments: department
        }
          res.status(200).json(response);
    });
});


router.post('/', (req,res,next)=>{

  DepartmentModel.find({department_name: req.body.department_name})
    .exec()
    .then(department=>{
        if(department.length >= 1){
            return res.status(409).json({
                message:"Department Exsits"
            })
        }
        else{
              
                    const department = new DepartmentModel({
                        department_name: req.body.department_name,
                    });
                    department.save()
                    .then(result =>{
                        console.log(result);
                        res.status(201).json({
                            message: 'Created Department Succesfully',
                        })  
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })  
                    });
        }
    });
});

 

module.exports = router;