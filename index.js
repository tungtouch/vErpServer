var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var request = require('request');

var async = require('async');

var fs = require('fs');

var d;

var ssid = "abd8d398-ddc2-4861-93e6-a72a66cedd8e";

var wFile = function(fileName, content) {
    fs.writeFile(fileName, content, function(err) {
        if(!err) {
            console.log('WriteFile success');
        }
    });
};

var rFile = function(pathFile, cb) {
    fs.readFile(pathFile, function(err, data) {
        if(!err) {
            cb(null, data.toString());
        } else {
            cb(err, err);
        }
    });
};


// Task data

var getProjects = {
    RequestAction:"SearchCategory",
    RequestClass:"Tasks",
    ParentCode:"xSystem.Category.Status",
    ConditionFields:"ParentCode",
    limit:50,
    start:"0",
    page:"1",
    StaticFields:"Name",
    SessionId:ssid
};

var SignIn = {
    RequestClass:"BPM",
    RequestAction:"SignIn",
    Account:"admin",
    Password:"1"
};

var getEmployee = {
    RequestAction: "SearchUsers",
    RequestClass:"BPM",
    limit:50,
    start:0,
    page:1,
    StaticFields:"UserId;Username",
    SessionId:ssid
};


var getCategories = {
    RequestAction:"SearchCategory",
    RequestClass:"Tasks",
    ParentCode:"xSystem.Category.Phase",
    ConditionFields:"ParentCode",
    page:1,
    start:0,
    limit:20,
    StaticFields:"Name",
    SessionId:ssid
};

// var getPhases = {
//     RequestAction:"SearchCategory",
//     RequestClass:"Tasks",
//     ParentCode:"xSystem.Category.Phase",
//     ConditionFields:"ParentCode",
//     page:1,
//     start:0,
//     limit:20,
//     StaticFields:"Name",
//     SessionId:"04376eaa-0c04-4eb1-8cf2-87acdd69ea88"
// };

var getTask = {
    RequestAction:"SearchCategory",
    RequestClass:"Tasks",
    ParentCode:"xSystem.Category.Task",
    ConditionFields:"ParentCode",
    StaticFields:"Name",
    page:1,
    start:0,
    limit:50,
    SessionId:ssid
};

var getTargets = {
    RequestAction:"SearchTarget",
    RequestClass:"Tasks",
    limit:20,
    page:1,
    start:0,
    SessionId:ssid
};

var getContracts = {
    RequestAction:"SearchDocument",
    RequestClass:"xDocument",
    StaticFields:"OfficialNumber;Id",
    StartIndex:1,
    EndIndex:20,
    Code:"Contract",
    ConditionFields:"StartIndex;EndIndex;Code;",
    page:1,
    start:0,
    SessionId:"04376eaa-0c04-4eb1-8cf2-87acdd69ea88"
};


// var getStatus = {
//     RequestAction:"SearchCategory",
//     RequestClass:"Tasks",
//     ParentCode:"xSystem.Category.Status",
//     ConditionFields:"ParentCode",
//     limit:50,
//     start:0,
//     page:1,
//     StaticFields:"Name",
//     SessionId:"04376eaa-0c04-4eb1-8cf2-87acdd69ea88"
// };

var getMilestone = {
    RequestAction:"SearchMilestone",
    RequestClass:"Tasks",
    ParentCode:"xSystem.Settings.Project.State",
    limit:50,
    start:0,
    page:1,
    StaticFields:"Name;Description",
    SessionId:ssid
};

var DeleteTask = {
    RequestAction:"DeleteTask",
    RequestClass:"Tasks",
    SessionId:ssid
};

var SearchTask = {
    RequestAction:"SearchTask",
    RequestClass:"Tasks",
    ConditionFields:"StartIndex;EndIndex;DateType",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Issue;Name;Project;Category;Target;ProjectPhase;Worker;Status;Milestone;PlanManHour;Progress;PlanStartDate;RemainingManHour;Created;Deadline;ReportFinishDate;Description;Id;State",
    DynamicFields:"ProjectName;ContractName;CategoryName;TargetName;ProjectPhaseName;WorkerName;StatusName;MilestoneName;Cause;StateName",
    StructFields:"Contract;TotalLikes;TotalComments",
    DateType:"PlanStartDate",
    SessionId:ssid
};


var InsertTask = {
    RequestAction:"InsertTask",
    RequestClass:"Tasks",
    ConditionFields:"StartIndex;EndIndex",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Issue;Name;Project;Category;Target;ProjectPhase;Worker;Status;Milestone;PlanManHour;Progress;PlanStartDate;RemainingManHour;Created;Deadline;ReportFinishDate;Description;Id;State",
    DynamicFields:"ProjectName;CategoryName;TargetName;ProjectPhaseName;WorkerName;StatusName;MilestoneName;Cause;StateName",
    SessionId:ssid
};

var UpdateTask = {
    RequestAction:"UpdateTask",
    RequestClass:"Tasks",
    ConditionFields:"StartIndex;EndIndex",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Issue;Name;Project;Category;Target;ProjectPhase;Worker;Status;Milestone;PlanManHour;Progress;PlanStartDate;RemainingManHour;Created;Deadline;ReportFinishDate;Description;Id;State",
    DynamicFields:"ProjectName;CategoryName;TargetName;ProjectPhaseName;WorkerName;StatusName;MilestoneName;Cause",
    SessionId:ssid
};

var getTasksNearDeadline = {
    RequestAction:"SearchTask",
    RequestClass:"Tasks",
    ConditionFields:"StartIndex;EndIndex;StartDate;EndDate;DateType;Worker",
    StaticFields:"Issue;Name;Project;Category;Target;ProjectPhase;Worker;Status;Milestone;PlanManHour;Progress;PlanStartDate;RemainingManHour;Created;Deadline;ReportFinishDate;Description;Id;State",
    DynamicFields:"ProjectName;CategoryName;TargetName;ProjectPhaseName;WorkerName;StatusName;MilestoneName;Cause",
    StructFields:"Contract;TotalLikes;TotalComments",
    DateType:"Deadline",
    SessionId:ssid
};

var getProjectNearFinish = {
    RequestAction:"SearchProject",
    RequestClass:"Tasks",
    ConditionFields:"StartIndex;EndIndex;DateType",
    StaticFields:"Name;Manager;Parent;Index;Status;Id;",
    DynamicFields:"ManagerName;ParentName;DepartmentName;StatusName;StateName;Version",
    StructFields:"Department;Progress;StartDate;State;FinishDate;PlanManHour;ActualManHour",
    DateType:"FinishDate",
    SessionId:ssid
};

var getContractNearLiquiDate = {
    RequestAction:"SearchDocument",
    RequestClass:"xDocument",
    Code:"Contract",
    ConditionFields:"StartIndex;EndIndex;Code;Status",
    StructFields:"Department;TotalValue;Payment1;Payment2;Payment3;BusinessExpense;CommissionExpense;ActualValue",
    StaticFields:"Type;OfficialNumber;PublishedDate;Signer;Parent;Status;Code;Id;State",
    DynamicFields:"TypeName;DepartmentName;SignerName;ParentName;StatusName",
    Status:"73b732d5-76d2-41d8-9494-7a771c4067bc",
    SessionId:ssid
};




// Contract data

var getContractType = {
    RequestAction:"SearchCategory",
    RequestClass:"xDocument",
    ParentCode:"xSystem.Settings.Contract.Type",
    ConditionFields:"StartIndex;EndIndex;ParentCode",
    StartIndex:1,
    EndIndex:50,
    StaticFields:"Name;Code",
    SessionId:ssid
};

var getCustomer = {
    RequestAction:"SearchProfile",
    RequestClass:"xProfile",
    Code:"Customer",
    ConditionFields:"StartIndex;EndIndex;Code",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Name;ShortName;Code;DisplayName",
    SessionId:ssid
};


var getTasksByContract = {
    ConditionFields:"StartIndex;EndIndex;Contract",
    ContractColumnType:0,
    DynamicFields:"ProjectName;ContractName;CategoryName;TargetName;ProjectPhaseName;WorkerName;StatusName;MilestoneName;Cause",
    EndIndex:50,
    RequestAction:"SearchTask",
    RequestClass:"Tasks",
    StartIndex:1,
    StaticFields:"Project;Issue;Name;Category;Target;ProjectPhase;Worker;Status;Milestone;PlanManHour;Progress;PlanStartDate;RemainingManHour;Created;Deadline;ReportFinishDate;Description;Id",
    StructFields:"Contract",
    SessionId:ssid
};

var getContractStatus = {
    RequestAction:"SearchCategory",
    RequestClass:"xDocument",
    ParentCode:"xSystem.Settings.Contract.Status",
    ConditionFields:"StartIndex;EndIndex;ParentCode",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Name;Code",
    SessionId:ssid
};

var SearchContract = {
    RequestAction:"SearchDocument",
    RequestClass:"xDocument",
    Code:"Contract",
    ConditionFields:"StartIndex;EndIndex;Code",
    StructFields:"Department;TotalValue;Payment1;Payment2;Payment3;BusinessExpense;CommissionExpense;ActualValue",
    StaticFields:"Type;OfficialNumber;PublishedDate;Signer;Parent;Status;Code;Id;State",
    DynamicFields:"TypeName;DepartmentName;SignerName;ParentName;StatusName",
    StartIndex:1,
    EndIndex:20,
    SessionId:ssid
};



// Product

var getProductType = {
    RequestAction:"SearchCategory",
    RequestClass:"xDocument",
    ParentCode:"xSystem.Settings.Product.Type",
    ConditionFields:"StartIndex;EndIndex;ParentCode",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Name;Code",
    SessionId:ssid
};

var getProductParent = {
    RequestAction:"SearchGroup",
    RequestClass:"BPM",
    ConditionFields:"GroupType",
    GroupType:1,
    limit:20,
    page:1,
    start:0,
    SessionId:ssid
};

var getProductStatus = {
    RequestAction:"SearchCategory",
    RequestClass:"xDocument",
    ParentCode:"xSystem.Settings.Product.Status",
    ConditionFields:"StartIndex;EndIndex;ParentCode",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Name;Code",
    SessionId:ssid
};

var SearchProduct = {
    RequestAction:"SearchDocument",
    RequestClass:"xDocument",
    Code:"Product",
    ConditionFields:"StartIndex;EndIndex;Code",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Title;Name;Type;Parent;Status;OfficialNumber;PublishedDate;ExpiredDate;Code;Id;State",
    DynamicFields:"TypeName;ParentName;StatusName",
    SessionId:ssid
};



// Project section

var getProjectManager = {
    RequestAction:"SearchUsers",
    RequestClass:"BPM",
    page:1,
    start:0,
    limit:20,
    StaticFields:"UserId;Username",
    SessionId:ssid
};

var getCustomers = {
    RequestAction:"SearchProfile",
    RequestClass:"xProfile",
    Code:"Customer",
    ConditionFields:"StartIndex;EndIndex;Code",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Name;ShortName;Code;DisplayName",
    SessionId:ssid
};

var getPriority = {
    RequestAction:"SearchCategory",
    RequestClass:"xDocument",
    ParentCode:"xSystem.Settings.Project.Priority",
    ConditionFields:"StartIndex;EndIndex;ParentCode",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Index;Name;Code",
    SessionId:ssid
};

var getDepartment = {
    RequestAction:"SearchGroup",
    RequestClass:"BPM",
    ConditionFields:"GroupType",
    GroupType:1,
    limit:20,
    page:1,
    start:0,
    SessionId:ssid
};

var getProjectStatus = {
    RequestAction:"SearchCategory",
    RequestClass:"xDocument",
    ParentCode:"xSystem.Settings.Project.Status",
    ConditionFields:"StartIndex;EndIndex;ParentCode",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Name;Code",
    SessionId:ssid
};

var getProjectState = {
    RequestAction:"SearchCategory",
    RequestClass:"xDocument",
    ParentCode:"xSystem.Settings.Project.State",
    ConditionFields:"StartIndex;EndIndex;ParentCode",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Index;Name;Code",
    SessionId:ssid
};

var searchPrj = {
    RequestAction:"SearchProject",
    RequestClass:"Tasks",
    page:1,
    start:0,
    limit:50,
    SessionId:ssid
};


var SearchProject = {
    RequestAction:"SearchProject",
    RequestClass:"Tasks",
    ConditionFields:"StartIndex;EndIndex",
    StartIndex:1,
    EndIndex:20,
    StaticFields:"Name;Manager;Parent;Index;Status;Id;",
    DynamicFields:"ManagerName;ParentName;DepartmentName;StatusName;StateName;Version",
    StructFields:"Department;Progress;StartDate;State;FinishDate;PlanManHour;ActualManHour",
    SessionId:ssid
};



// Contact section

var getSectors = {
    RequestAction:"SearchCategory",
    RequestClass:"xProfile",
    StaticFields:"Name;Code",
    StartIndex:1,
    EndIndex:20,
    ParentCode:"xSystem.Category.Sector",
    ConditionFields:"StartIndex;EndIndex;ParentCode;",
    page:1,
    start:0,
    SessionId:ssid
};

var getGenders = {
    RequestAction:"SearchCategory",
    RequestClass:"xProfile",
    StaticFields:"Name;Code",
    StartIndex:1,
    EndIndex:20,
    ParentCode:"xProfile.Category.Gender",
    ConditionFields:"StartIndex;EndIndex;ParentCode",
    page:1,
    start:0,
    SessionId:ssid
};

var getCompanies = {
    RequestAction:"SearchProfile",
    RequestClass:"xProfile",
    StaticFields:"DisplayName",
    StartIndex:1,
    EndIndex:20,
    Code:"Customer;Provider;Partner",
    ConditionFields:"StartIndex;EndIndex;Code",
    page:1,
    start:0,
    SessionId:ssid
};


var getLocations = {
    RequestAction:"SearchTerritory",
    RequestClass:"xProfile",
    StaticFields:"Name;Code",
    StartIndex:1,
    EndIndex:20,
    ConditionFields:"StartIndex;EndIndex",
    page:1,
    start:0,
    SessionId:ssid
};

var getCurators = {
    RequestAction:"SearchUser",
    RequestClass:"BPM",
    limit:20,
    start:0,
    page:1,
    SessionId:ssid
};

var getContactPerson = {
    RequestAction:"SearchProfile",
    RequestClass:"xProfile",
    StaticFields:"DisplayName",
    StartIndex:1,
    EndIndex:20,
    Code:"Contact",
    ConditionFields:"StartIndex;EndIndex;Code",
    page:1,
    start:0,
    SessionId:ssid
};


var getOrganization = {
    RequestAction:"SearchGroup",
    RequestClass:"BPM",
    limit:20,
    start:0,
    page:1,
    GroupType:1,
    ConditionFields:"GroupType",
    SessionId:ssid
};



//// Manage contact ------------------------------

var DeleteContact = {
    RequestAction:"DeleteProfile",
    RequestClass:"xProfile",
    SessionId:ssid
};

var SearchContact = {
    RequestAction:"SearchProfile",
    RequestClass:"xProfile",
    ConditionFields:"StartIndex;EndIndex",
    StaticFields:"Index;DisplayName;Address;Email;IM;Birthday;IdentityCode;TaxCode;Website;Sector;Id;State",
    DynamicFields:"Facebook;SectorName",
    StartIndex:1,
    EndIndex:20,
    SessionId:ssid
};

var UpdateContact = {
    RequestAction:"UpdateProfile",
    RequestClass:"xProfile",
    ConditionFields:"StartIndex;EndIndex",
    StaticFields:"Index;DisplayName;Address;Email;IM;Birthday;IdentityCode;TaxCode;Website;Sector;Id",
    DynamicFields:"Facebook;SectorName",
    StartIndex:1,
    EndIndex:20,
    SessionId:ssid
};

var InsertContact = {
    RequestAction:"InsertProfile",
    RequestClass:"xProfile",
    ConditionFields:"StartIndex;EndIndex",
    StaticFields:"Index;DisplayName;Address;Email;IM;Birthday;IdentityCode;TaxCode;Website;Sector;Id",
    DynamicFields:"Facebook;SectorName",
    StartIndex:1,
    EndIndex:20,
    SessionId:ssid
};


// Contact address

var SearchContactAddress = {
    RequestClass:"xProfile",
    RequestAction:"SearchProfile",
    StartIndex:1,
    EndIndex:20,
    ConditionFields:"StartIndex;EndIndex;Code",
    StaticFields:"Index;DisplayName;Phone;Gender;Address;Email;Birthday;IM;Parent;Code;Id",
    DynamicFields:"GenderName;ParentName",
    Code:"Contact",
    SessionId:ssid
};


// Contact customer
var SearchContactCustomer = {
    RequestAction:"SearchProfile",
    RequestClass:"xProfile",
    ConditionFields:"StartIndex;EndIndex;Code",
    StaticFields:"Index;ShortName;DisplayName;Address;Location;Phone;Fax;Email;IM;Birthday;IdentityCode;TaxCode;Website;Sector;BankAccount;BankName;Code;Id",
    DynamicFields:"InternationalName;LocationName;CuratorName;ContactPersonName;Facebook;SectorName",
    StructFields:"Curator;ContactPerson",
    Code:"Customer",
    StartIndex:1,
    EndIndex:20,
    SessionId:ssid
};

// Contact employee

var SearchContactEmployee = {
    RequestAction:"SearchProfile",
    RequestClass:"xProfile",
    ConditionFields:"StartIndex;EndIndex;Code",
    StaticFields:"Index;DisplayName;Address;Email;Fax;Phone;IM;Birthday;IdentityCode;Id;TaxCode;Website;Sector;Gender;Organization;Title;BankAccount;BankName;Code;Id",
    DynamicFields:"IdentityPlace;IdName;Facebook;SectorName;BirthPlace;MaritalStatus;OrganizationName;TitleName;Manager;InsurancePlace;PermanentResident;VacationUsed;VacationLeft;ParentalLeave",
    StructFields:"IdentityDate;TrialPeriodDate;ContractDate;Salary;InsuranceDate;InsuranceStartDate",
    Code:"Employee",
    StartIndex:1,
    EndIndex:20,
    SessionId:ssid
};

// Contact partner

var SearchContactPartner = {
    RequestClass:"xProfile",
    RequestAction:"SearchProfile",
    StartIndex:1,
    EndIndex:20,
    ConditionFields:"StartIndex;EndIndex;Code;",
    StaticFields:"Index;ShortName;DisplayName;Address;Location;Phone;Fax;Email;IM;Birthday;IdentityCode;TaxCode;Website;Sector;BankAccount;BankName;Code;Id",
    DynamicFields:"InternationalName;LocationName;CuratorName;ContactPersonName;Facebook;SectorName",
    StructFields:"Curator;ContactPerson",
    Code:"Partner",
    SessionId:ssid
};

// Contact provider

var SearchContactProvider = {
    RequestClass:"xProfile",
    RequestAction:"SearchProfile",
    StartIndex:1,
    EndIndex:20,
    ConditionFields:"StartIndex;EndIndex;Code;",
    StaticFields:"Index;ShortName;DisplayName;Address;Location;Phone;Fax;Email;IM;Birthday;IdentityCode;TaxCode;Website;Sector;BankAccount;BankName;Code;Id",
    DynamicFields:"InternationalName;LocationName;CuratorName;ContactPersonName;Facebook;SectorName",
    StructFields:"Curator;ContactPerson",
    Code:"Provider",
    SessionId:ssid
};



var sumTaskByPrj = {
    RequestAction:"SummaryTaskByProject",
    RequestClass:"Tasks",
    ConditionFields:"StartDate;EndDate;DateType;",
    DateType:"PlanStartDate",
    StartDate:"2014-11-07",
    EndDate:"2014-12-07",
    SessionId:"b32176d7-445f-4c33-a078-345228b54807"
};

var sumTaskByTarget = {
    RequestAction:"SummaryTaskByTarget",
    RequestClass:"Tasks",
    ConditionFields:"StartDate;EndDate;DateType;",
    DateType:"PlanStartDate",
    StartDate:"2014-11-07",
    EndDate:"2014-12-07",
    SessionId:"b32176d7-445f-4c33-a078-345228b54807"
}

var sumTaskByWorker = {
    RequestAction:"SummaryTaskByWorker",
    RequestClass:"Tasks",
    ConditionFields:"StartDate;EndDate;DateType;",
    DateType:"PlanStartDate",
    StartDate:"2014-08-25",
    EndDate:"2014-09-24",
    SessionId:"6633dc42-f5c3-4b49-abe4-9c52ded2e13b"
}

var sumTaskByCategory = {
    RequestAction:"SummaryTaskByCategory",
    RequestClass:"Tasks",
    ConditionFields:"ParentCode;CategoryColumn;StartDate;EndDate;DateType",
    CategoryColumn:"ProjectPhase",
    ParentCode:"xSystem.Category.Phase",
    DateType:"PlanStartDate",
    StartDate:"2014-08-25",
    EndDate:"2014-09-24",
    SessionId:"6633dc42-f5c3-4b49-abe4-9c52ded2e13b"
}

var sumTaskByStatus = {
    RequestAction:"SummaryTaskByStatus",
    RequestClass:"Tasks",
    ConditionFields:"StartDate;EndDate;DateType;",
    DateType:"PlanStartDate",
    StartDate:"2014-08-25",
    EndDate:"2014-09-24",
    SessionId:"6633dc42-f5c3-4b49-abe4-9c52ded2e13b"
};


var contractSum = {
    Code:"Contract",
    DynamicFields:"TypeName;DepartmentName;SignerName;ParentName;StatusName",
    RequestAction:"SearchDocument",
    RequestClass:"xDocument",
    StaticFields:"Type;OfficialNumber;PublishedDate;Signer;Parent;Status;Code;Id",
    StructFields:"Department;TotalValue;Payment1;Payment2;Payment3;BusinessExpense;CommissionExpense;ActualValue",
    OrderFields:"PublishedDate ASC",
    SessionId:"3a58dc76-4cc3-47d4-be13-243f7028e325"
}

var contractSum2 = {

    Code:"Contract",
    DynamicFields:"TypeName;DepartmentName;SignerName;ParentName;StatusName",
    RequestAction:"SearchDocument",
    RequestClass:"xDocument",
    StaticFields:"Type;OfficialNumber;PublishedDate;Signer;Parent;Status;Code;Id",
    StructFields:"Department;TotalValue;Payment1;Payment2;Payment3;BusinessExpense;CommissionExpense;ActualValue",
    SessionId:"6633dc42-f5c3-4b49-abe4-9c52ded2e13b"
}


var departName = {
    DynamicFields:"DepartmentName",
    RequestAction:"SearchProject",
    RequestClass:"Tasks",
    StaticFields:"Name;Id",
    StructFields:"Department",
    SessionId:"8c07748e-d8a5-4960-b819-d2de7a75221f"
}

var statusNamePrj = {
    DynamicFields:"StatusName",
    RequestAction:"SearchProject",
    RequestClass:"Tasks",
    StaticFields:"Name;Status;Id",
    SessionId:"8c07748e-d8a5-4960-b819-d2de7a75221f"
}

var stPrj = {
    DynamicFields:"ManagerName;ParentName;IndexName;DepartmentName;StatusName;StateName;Version",
    RequestAction:"SearchProject",
    RequestClass:"Tasks",
    StaticFields:"Name;Manager;Parent;Index;Status;Id",
    StructFields:"Department;Progress;StartDate;State;PlanManHour;ActualManHour;RemainingManHour;InlineManHour;MissDeadlineManHour",
    SessionId:"8c07748e-d8a5-4960-b819-d2de7a75221f"
}

var employeeL = {
    RequestAction:"SearchCategory",
    RequestClass:"xProfile",
    StaticFields:"Name;Code",
    limit:20,
    start:0,
    page:1,
    ParentCode:"xSystem.Setting.Title",
    ConditionFields:"ParentCode;",
    SessionId:"8c07748e-d8a5-4960-b819-d2de7a75221f"
}

var eL2 = {
    RequestAction:"SearchProfile",
    RequestClass:"xProfile",
    ConditionFields:"StartIndex;EndIndex;Code",
    StaticFields:"Index;DisplayName;Address;Email;Fax;Phone;IM;Birthday;IdentityCode;Id;TaxCode;Website;Sector;Gender;Organization;Title;BankAccount;BankName;Code;Id",
    DynamicFields:"IdentityPlace;IdName;Facebook;SectorName;BirthPlace;MaritalStatus;OrganizationName;TitleName;Manager;InsurancePlace;PermanentResident;VacationUsed;VacationLeft;ParentalLeave",
    StructFields:"IdentityDate;TrialPeriodDate;ContractDate;Salary;InsuranceDate;InsuranceStartDate",
    Code:"Employee",
    StartIndex:1,
    EndIndex:10,
    SessionId:"8c07748e-d8a5-4960-b819-d2de7a75221f"
}

var sTerry = {
    RequestAction:"SearchTerritory",
    RequestClass:"xProfile",
    StaticFields:"Name;Code",
    StartIndex:1,
    EndIndex:100,
    ConditionFields:"StartIndex;EndIndex",
    page:1,
    start:0,
    SessionId:"8c07748e-d8a5-4960-b819-d2de7a75221f"
}

var sumTaskByGroup = {

    ConditionFields:"GroupType",
    GroupType:1,
    RequestAction:"SummaryTaskByGroup",
    RequestClass:"Tasks",
    SessionId:"8c07748e-d8a5-4960-b819-d2de7a75221f"
}


var planed = {
    RequestAction:"SearchTask",
    RequestClass:"Tasks",
    ConditionFields:"StartIndex;EndIndex;DateType;State",
    StartIndex:1,
    EndIndex:10,
    StaticFields:"Issue;Name;Project;Category;Target;ProjectPhase;Worker;Status;Milestone;PlanManHour;Progress;PlanStartDate;RemainingManHour;Created;Deadline;ReportFinishDate;Description;Id;State",
    DynamicFields:"ProjectName;ContractName;CategoryName;TargetName;ProjectPhaseName;WorkerName;StatusName;MilestoneName;Cause;StateName",
    StructFields:"Contract;TotalLikes;TotalComments",
    DateType:"PlanStartDate",
    SessionId:ssid,
    State:16
}


// request.post({url: 'http://money.xoffice.vn/xRequest.ashx', formData: planed}, function (err, data) {
//     wFile('json/planed.json', data.body);
// });




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var acc = {
    Account: "admin",
    Password: "1",
    token: "6633dc42-f5c3-4b49-abe4-9c52ded2e13b"
};


app.get('/', function(req, res) {
    res.json('Load to Index');
    console.log(req.body);

});

// var json = require('./json/SearchTask.json');

// var arr = json.Data.TasksDS.Task;
// var start = 100;
// var end = 200;
// var i = 0;

// function cutArray (arr, start, end) {
// 		return arr.slice(start, end);
// }

// var r = new cutArray(arr, start, end);

// console.log(res, res.length);

app.post('/', function(req, res) {

    console.log(req.body);

    if((req.body.Account == acc.Account) && (req.body.Password == acc.Password)) {
        res.send(acc.token);
    }

    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Category.Task") {
        rFile('json/getTask.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Category.Phase") {
        rFile('json/getCategories.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Category.Status") {
        rFile('json/getProjects.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchMilestone") {
        rFile('json/getMilestone.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchUsers") {
        rFile('json/getEmployee.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchTarget") {

        rFile('json/getTargets.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchProject" && req.body.page == 1 && req.body.RequestClass == "Tasks") {

        rFile('json/searchPrj.json', function(err, dt) {
            res.send(JSON.parse(dt));
        });
    } else



    if(req.body.RequestAction == "SearchDocument" && req.body.ConditionFields == "StartIndex;EndIndex;Code;") {
        rFile('json/getContracts.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchDocument" && req.body.ConditionFields == "StartIndex;EndIndex;Code;Status") {
        rFile('json/getContractNearLiquiDate.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchProject" && req.body.DateType == "FinishDate") {
        rFile('json/getProjectNearFinish.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else


    if(req.body.RequestAction == "SearchTask" && req.body.DateType == "Deadline") {
        rFile('json/getTasksNearDeadline.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchTask" && req.body.DateType == "PlanStartDate") {
        rFile('json/SearchTask.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Settings.Contract.Type") {
        rFile('json/getContractType.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchGroup") {

        rFile('json/getOrganization.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else


    if(req.body.RequestAction == "SearchProfile" && req.body.StaticFields == "Name;ShortName;Code;DisplayName") {
        rFile('json/getCustomers.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Settings.Contract.Status") {
        rFile('json/getCustomers.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchDocument" && req.body.ConditionFields == "StartIndex;EndIndex;Code") {
        rFile('json/SearchContract.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else


    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Settings.Project.Priority") {
        rFile('json/getPriority.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else



    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Settings.Project.Status") {
        rFile('json/getProjectStatus.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else



    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Settings.Project.State") {
        rFile('json/getProjectState.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchProject" && req.body.ConditionFields == "StartIndex;EndIndex") {
        rFile('json/SearchProject.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else



    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Category.Sector") {
        rFile('json/getSectors.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else


    if(req.body.RequestAction == "SearchProfile" && req.body.DynamicFields == "Facebook;SectorName") {
        rFile('json/SearchContact.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else



    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Settings.Product.Type") {
        rFile('json/getProductType.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else



    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Settings.Product.Status") {
        rFile('json/getProductStatus.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else



    if(req.body.RequestAction == "SearchDocument" && req.body.DynamicFields == "TypeName;ParentName;StatusName") {
        rFile('json/SearchProduct.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchTask" && req.body.ConditionFields == "StartIndex;EndIndex;DateType;State") {
        rFile('json/planed.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }





    /// Handler GUI
    if(req.body.RequestAction == "SummaryTaskByProject") {
        rFile('json/sumTaskByPrj.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.RequestAction == "SummaryTaskByTarget") {
        rFile('json/sumTaskByTarget.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.RequestAction == "SummaryTaskByWorker") {
        rFile('json/sumTaskByWorker.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.RequestAction == "SummaryTaskByCategory") {
        rFile('json/sumTaskByCategory.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.RequestAction == "SummaryTaskByStatus") {
        rFile('json/sumTaskByStatus.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.RequestAction == "SearchDocument" && req.body.OrderFields == "PublishedDate ASC") {
        rFile('json/contractSum.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    } else

    if(req.body.RequestAction == "SearchDocument" && req.body.StaticFields == "Type;OfficialNumber;PublishedDate;Signer;Parent;Status;Code;Id") {
        rFile('json/contractSum2.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }

//    req.body.RequestAction == "SearchDocument" && req.body.DynamicFields == "DepartmentName" && req.body.StaticFields == "Name;Id"

    if(req.body.DynamicFields == "DepartmentName") {

        rFile('json/departName.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.RequestAction == "SummaryTaskByGroup") {
        rFile('json/sumTaskByGroup.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }


    if(req.body.RequestAction == "SearchProject" && req.body.StructFields == "Department;Progress;StartDate;State;PlanManHour;ActualManHour;RemainingManHour;InlineManHour;MissDeadlineManHour") {
        rFile('json/stPrj.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.DynamicFields == "StatusName") {
        rFile('json/statusNamePrj.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }


    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xSystem.Setting.Title") {
        rFile('json/employeeL.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }

    if(req.body.RequestAction == "SearchProfile" && req.body.Code == "Employee") {
        rFile('json/eL2.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }

    if(req.body.RequestAction == "SearchTerritory") {
        rFile('json/sTerry.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }


    if(req.body.RequestAction == "SearchUser") {
        rFile('json/getCurators.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.RequestAction == "SearchProfile" && req.body.StaticFields == "DisplayName" && req.body.Code == "Contact") {
        rFile('json/getContactPerson.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }


    if(req.body.StructFields == "Curator;ContactPerson" && req.body.Code == "Customer") {
        rFile('json/SearchContactCustomer.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }


    if(req.body.StructFields == "Curator;ContactPerson" && req.body.Code == "Provider") {
        rFile('json/SearchContactProvider.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }


    if(req.body.StructFields == "Curator;ContactPerson" && req.body.Code == "Partner") {
        rFile('json/SearchContactPartner.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.RequestAction == "SearchCategory" && req.body.ParentCode == "xProfile.Category.Gender") {
        rFile('json/getGenders.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }


    if(req.body.RequestAction == "SearchProfile" && req.body.Code == "Customer;Provider;Partner") {
        rFile('json/getCompanies.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }



    if(req.body.DynamicFields == "GenderName;ParentName" && req.body.Code == "Contact") {
        rFile('json/SearchContactAddress.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });
    }




});













app.post('/userInfo', function(req, res) {

    console.log(req.body);

    if(req.body.SessionId === acc.token) {
        rFile('json/userInfo.json', function(err, data) {
            res.json(JSON.parse(data));
        });
    } else {
        res.json('Permission dennied');
    }
});

app.post('/:methodName', function(req, res) {
    switch (req.params.methodName) {
    case "SearchContactProvider":
        rFile('json/contact/SearchContactProvider.json', function(err, dt) {
            res.json(JSON.parse(dt));
        });

        break;
    default:
        break;
    }
    console.log(req.params.methodName);
});


// async.series([
//     function(callback) {
//         callback(null, getData(f));
//     },
//     function(callback) {
//         callback(null, 'two');
//     }
// ], function(err, res) {
//     console.log(res);
// });


app.listen(9000, function() {
    console.log('Server was running at port 9000');
});
