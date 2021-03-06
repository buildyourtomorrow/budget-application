var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		unique: true,
		default: "Eliezer"
	},
	hash: String, // this is where the password goes. It will be saved as a hash.
	salt: String,
	monthlyBills: [],
	billsTotal: {
		type: Number,
		default: 0
	},	
	income: [],
	totalIncome: {
		type: Number,
		default: 0
	},
	spendingLimit: {
		type: Number,
		default: 0
	},
	totalSpent: {
		type: Number,
		default: 0
	},
	leftOver: {
		type: Number,
		default: 0
	},	
	upBy: {
		type: Number,
		default: 0
	},
	dailyBudget: {
		type: Number,
		default: 0
	},
	daysLeft: {
		type: Number,
		default: 0
	},
	periodStart: Date,
	periodEnd: Date,
	today: Date,
	monthlyExpenses: [{ 
		description: String,
		amount: Number,
		date: Date
	}]
});

UserSchema.methods.calcTotalIncome = function(allIncome){		
	var total = 0;
	for (i = 0; i < allIncome.length; i++) {	
		total = total + allIncome[i].amount;
	};
	this.totalIncome = total;
	this.save();
};

UserSchema.methods.calcTotalBills = function(allbills){		
	var total = 0;
	for (i = 0; i < allbills.length; i++) {	
		total = total + allbills[i].amount;
	};
	this.billsTotal = total;
	this.save();
};

UserSchema.methods.calcTotalSpent = function(allMonthlyExpenses){		
	var total = 0;
	for (i = 0; i < allMonthlyExpenses.length; i++) {	
		total = total + allMonthlyExpenses[i].amount;
	};
	this.totalSpent = total;
	this.save();
};

UserSchema.methods.calcLeftOver = function(){
	this.leftOver = this.spendingLimit - this.totalSpent;
	this.save();
};

UserSchema.methods.calcUpBy = function(){
	this.upBy = ( this.dailyBudget * ( (this.today.getDate() - this.periodStart.getDate()) + 1) ) -  this.totalSpent;
	this.save();
};

UserSchema.methods.calcDailyBudget = function(){
	this.dailyBudget = this.spendingLimit / ( (this.periodEnd.getDate() - this.periodStart.getDate()) + 1 )
	this.save();
};

UserSchema.methods.calcDaysLeft = function(){
	this.daysLeft = this.periodEnd.getDate() - this.today.getDate();
	this.save();
};

UserSchema.methods.calcPeriodStart = function(){
	var today = new Date();
	var mm = today.getMonth() + 1;
	var dd = 1;
	var year = today.getFullYear();
	this.periodStart = mm + '/' + dd + '/' + year;	
	this.save();
};

UserSchema.methods.calcPeriodEnd = function(){
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var o = new Date(year, month, 0);
	var mm = o.getMonth() + 1;
	var dd = o.getDate();
	var yyyy = o.getFullYear();
	this.periodEnd = mm + '/' + dd + '/' + yyyy;
	this.save();
};

UserSchema.methods.calcToday = function(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	this.today = mm + '/' + dd + '/' + yyyy; 
	this.save();
};

mongoose.model('user', UserSchema);