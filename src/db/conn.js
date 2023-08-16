const mongoose = require("mongoose");

mongoose.connect(`${process.env.DB_CONNECTION}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`no connection` + e);
})