const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRender");
let employees = [];

inquirer
    .prompt([
        {
            type: 'input',
            name: 'teamMembers',
            message: 'How many members are there on your team?'
        },
        {
            type: 'input',
            name: 'name',
            message: 'What is your name?'
        },
        {
            type: 'input',
            name: 'id',
            message: 'What is your ID number?'
        },
        {
            type: 'input',
            name: 'email',
            message: 'What is your email address?'
        },
        {
            type: 'input',
            name: 'office',
            message: 'What is your office number?'
        }
    ])
    .then(async answers => {
        const manager = new Manager(answers.name, answers.id, answers.email, answers.office);
        employees.push(manager);
        await createTeam(answers.teamMembers);
    })

    async function createTeam (members){
        let i = 0;
        while(i < members){
            await inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'memberType',
                        message: "Is the team member an Engineer or Intern?",
                        choices: ['Engineer', 'Intern']
                    },
                    {
                        type: 'input',
                        name: 'name',
                        message: 'What is their name?'
                    },
                    {
                        type: 'input',
                        name: 'id',
                        message: 'What is their ID number?'
                    },
                    {
                        type: 'input',
                        name: 'email',
                        message: 'What is their email address?'
                    }
                ])
                .then(async answers =>{
                    if(answers.memberType === 'Engineer'){
                        let github = await createEng();
                        const e = new Engineer(answers.name, answers.id, answers.email, github);
                        employees.push(e);
                        console.log(e);
                    } else{
                        let school = await createIntern();
                        const intern = new Intern(answers.name, answers.id, answers.email, school);
                        employees.push(intern);
                        console.log(intern);
                    }
                })
                i++;
        }
        let response = await render(employees);
        fs.writeFile(outputPath, response, function(err){
            if(err) throw err;
            console.log("Created successfully");
        })
    }

    async function createEng(){
        let git = ""
        await inquirer
        .prompt([
            {
                type: 'input',
                name: 'github',
                message: 'What is their github username?'
            }
        ])
        .then(answers =>{
            git = answers.github;
        })
        return git;
    }

    async function createIntern(){
        let school = "";
        await inquirer
        .prompt([
            {
                type: 'input',
                name: 'school',
                message: 'Which school do they attend?'
            }
        ])
        .then(answers =>{
            school = answers.school;
        })
        return school;
    }