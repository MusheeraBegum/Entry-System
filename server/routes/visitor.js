const router = require('express').Router(),
    uniqid = require('uniqid');

//requiring needed schemas
let visitor = require("../Association/models/visitors");
let host = require("../Association/models/hosts");
require('dotenv').config();


//Handling Get Reaquest for visitors and response with list of visitor
router.route('/').get((req, res) => {
    visitor.find()

        .then(visitors => res.send(visitors))

        .catch(err => res.status(400).json('error:', err))
})

//Handling Get Reaquest for visitors who are In at a particular time and response with list of visitor
router.route('/inVisitor').get((req, res) => {
    visitor.find({ status: "In" })

        .then(visitors => res.send(visitors))

        .catch(err => res.status(400).json('error:', err))
})


//Handling Post Reaquest for adding Visitor
router.route("/addInfo").post((req, res) => {

    //Getting data from request
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const hostName = req.body.hostName;
    const hostPhone = req.body.hostPhone;
    const hostEmail = req.body.hostEmail;
    const address = req.body.address;
    const checkInTime = new Date().getTime();
    const t = new Date().getTime();
    const status = 'In';
    const uniqId = uniqid();

    //Create newVisitor Object
    const newVisitor = new visitor({
        name,
        email,
        phone,
        checkInTime,
        address,
        status,
        uniqId,
        hostName,
        hostEmail,
        hostPhone

    });

    //Saving newVisitor Object
    newVisitor.save()

        .then((err, newVisitor) => {
            host.findById(hostName)

                .then((host) => {
                    res.send(uniqId);
                }
                )
                .catch(err => res.send(err))

        })
        .catch((err) => res.send(err));

});

//Handling GET request for finding VisitorById
router.route('/:uniqid').get((req, res) => {

    visitor.findOne({ uniqId: req.params.uniqid })

        .then((currentvisiter) => {

            res.send(currentvisiter)

        })

        .catch((err) => res.status(400).send("Error:", err));
});

//Handling GET request for finding VisitorById
router.route('/:uniqid').post((req, res) => {


    visitor.findOne({ uniqId: req.params.uniqid }).populate('hostName')                                               //populateBy hostname to get host of Visitor

        .then((checkoutVisitor) => {

            visitor.updateOne(checkoutVisitor, { status: 'Out', checkOutTime: new Date().getTime() }, function (err, out) {
                if (err) {
                    res.send("there is an errr");
                }
                else {
                    res.send("Done");
                }
            });
        })

        .catch((err) => res.status(400).send("err: ", err));
});

module.exports = router;    