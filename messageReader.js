// COMMUNIQUE
// A P2P MESSAGING PROGRAM
// © 2020 NDH LTD.
// CREATED BY NICHOLAS BERNHARD

/*

Some things this messaging program could do:

* Show all new messages at startup 
* Show new messages as they come in
* Mute/unmute certain conversations
* Automatically name text files
* Move between conversations

*/

const testFolder = './text/';
const messageFolder = "./messages/";
const fs = require('fs');

const ABOUT_STRING =
    `
COMMUNIQUE

A MESSAGING TOOL FOR P2P FILE-SYNC PROGRAMS.
\u00A9 2020 NDH LTD.
CREATED BY NICHOLAS BERNHARD
`;

// Arbitrary reference object for the menu loop to validate quitting.
const QUIT_MAIN_LOOP = {};

const readline = require("readline");
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showChatLogs() {
    fs.readdir(testFolder, (err, files) => {
        files.forEach(function (item, index) {
            console.log("****")
            var text = fs.readFileSync((testFolder + item), 'utf8');
            if (!((index % 2) === 0)) {
                console.log("\t" + text);
            } else {
                console.log(text);
            }
            console.log("\n");
        });
    });
}

async function checkForNewMessages() {
    let lastChecked = fs.readFileSync("lastChecked.txt", "utf8");
    let lastCheckedInt = parseInt(lastChecked);
    await new Promise((res, rej) => fs.readdir(messageFolder, (err, directories) => {
        if (err) {
            rej(err)
        } else {
            res(directories)
        }
    })).then(async directories =>
        (await Promise.all(directories.map(function (directory) {
            return new Promise(res => fs.readdir((messageFolder + directory + "/"), (err, files) => {
                res(files.filter(function (file) {
                    let lastModified = fs.statSync(messageFolder +
                        directory + "/" + file).mtimeMs;
                    return lastModified > lastCheckedInt;
                }).map(file => messageFolder + directory + "/" + file));
            }));
        }))).flat()).then(filesToPrint => {
        printMessages(filesToPrint);
        setDate();
    }).catch(err => console.error(err));
}

function printMessages(messageFiles) {
    if (messageFiles.length > 0) {
        messageFiles.forEach(function (newFile) {
            let newFileSender = newFile.split("/")[2];
            let newMessage = fs.readFileSync(newFile, "utf8");
            console.log(
                "\n" +
                "* * * * * " + "\n" +
                "NEW MESSAGE FROM: " + newFileSender + "\n" +
                "\n" +
                newMessage + "\n" +
                "\n"
            );
        });
        if (messageFiles.length === 1) {
            console.log("YOU HAVE ONE NEW MESSAGE." + "\n");
        } else if (messageFiles.length >= 2) {
            console.log("YOU HAVE " + messageFiles.length + " MESSAGES.");
        }
    } else {
        console.log(
            "\n" +
            "\n" +
            "NO NEW MESSAGES." + "\n");
    }
}

async function listContacts() {
    
    const contacts = await new Promise(res => fs.readdir(messageFolder, (err, files) => {
        let contacts = [];
        files.forEach(function (directory) {
            contacts.push(directory);
            console.log(directory);
        })
        res(contacts);
    }));
    
    const contactName = await selectContact(contacts)
    if (contactName !== "") {
        console.log("YOU CHOSE " + contactName + ".");
    }
}

function selectContact(contacts) {
    return new Promise((res, rej) => rl.question("\n" +
        "ENTER CONTACT NAME OR LEAVE BLANK TO QUIT: ",
        function (contactName) {
            if (!contacts.includes(contactName) && contactName !== "") {
                console.log(
                    "CONTACT NOT FOUND." +
                    "\n"
                );
                rej();
            } else {
                res(contactName);
            }
        }
    )).catch(_ => selectContact(contacts));
}

function startupWelcome() {
    console.log("WELCOME TO COMMUNIQUE.");
}

startupWelcome();

function aboutCommunique() {
    console.log(ABOUT_STRING);
}

function communiqueHelp() {
    console.log(
        "HELP TOPICS:" + "\n"
    );
    let helpTopics = [
        "COMMANDS", "OTHER STUFF"
    ];
    helpTopics.forEach(function (item) {
        console.log(item);
    });
}

async function signatureEditor() {
    await new Promise(res => rl.question(
        "\n" +
        "CREATE SIGNATURE, OR TYPE 'MENU' TO CANCEL: ",
        function (signature) {
            if (signature.toLowerCase() !== "menu") {
                fs.writeFile(
                    "messageSignature.txt", signature,
                    function (err) {
                        if (err) throw err;
                        showSignature();
                        res();
                    }
                );
                console.log(
                    "\n" +
                    "\n" +
                    "SIGNATURE CREATED."
                );
            } else {
                res();
            }
        }
    ));
}

function showSignature() {
    if (!fs.existsSync("messageSignature.txt")) {
        console.log(
            "\n" +
            "NO SIGNATURE HAS BEEN SET UP."
        );
    } else {
        let readSignatureBack = fs.readFileSync(
            "messageSignature.txt", "utf8"
        );
        console.log(
            "\n" +
            "\n" +
            "YOUR MESSAGE SIGNATURE:" + "\n" +
            "\n" +
            readSignatureBack + "\n"
        );
    }
}

let oldInboxLength = 0;

function chatListener(receiver) {
    setInterval(function () {
        let newInboxLength = 0;
        fs.readdir((messageFolder + receiver + "/"), (err, files) => {
            newInboxLength = files.length;
        });
        // if (newInboxLength > oldInboxLength) {

        // }
    }, 2000);
}

async function chat() {
    // console.clear();
    const receiver = await new Promise(res => rl.question(
        "\n" +
        "CHAT WITH: ",
        (selection) => res(selection)
    ));
    // fs.readdir((messageFolder + receiver + "/"), (err, files) => {
    //     oldInboxLength = files.length;
    // });
    const [message, fileName] = await new Promise(res => rl.question("MESSAGE FOR " + receiver + ": ", function (message) {
        let numberOfFiles = 0;
        fs.readdir(messageFolder + receiver + "/", (err, files) => {
            numberOfFiles = files.length;
        });
        res([message, numberOfFiles]); //TODO: Use a better UUID+filename than `numberOfFiles` (e.g., may NOT be unique!) 
    }));
    fs.writeFile(
        messageFolder + receiver + "/" + fileName +
        ".txt", message,
        function (err) {
            if (err) throw err;
        }
    );
    console.log("MESSAGE SENT.");
}

const actions = {
    check: checkForNewMessages,
    newsig: signatureEditor,
    sig: showSignature,
    menu: menu,
    about: aboutCommunique,
    help: communiqueHelp,
    date: setDate,
    quit: quitProgram,
    contacts: listContacts,
    chat: chat,
}

async function menu() {
    let inMenu = true
    while (inMenu) {
        await new Promise(res => rl.question("\n" +
            "WHAT WOULD YOU LIKE TO DO? ",
            async function (response) {
                if (response !== "menu") { // Avoid nested calls to menu.
                    const actionToDo = actions[response];
                    if (actionToDo) {
                        inMenu = QUIT_MAIN_LOOP !== await actionToDo();
                    } else {
                        console.log(
                            "\n" +
                            "COMMAND NOT RECOGNIZED."
                        );
                    }
                }
                res();
            }
        ));
    }
}

setTimeout(menu, 1000);

function setDate() {

    let date = Date.now().toString();

    fs.writeFile(
        "lastChecked.txt", date,
        function (err) {
            if (err) throw err;
        }
    );

    // console.log("DATE SET: " + date);

}

function quitProgram() {
    setDate();
    console.log(
        "\n" +
        "\n" +
        "QUITTING PROGRAM..."
    );
    console.log(
        "\n" +
        "THANK YOU FOR USING COMMUNIQUE." + "\n" +
        "GOODBYE.");
    setTimeout(function () {
        process.exit(0);
    }, 500);
    return QUIT_MAIN_LOOP
}

// rl.on("close", function () {
//     quitProgram();
// });