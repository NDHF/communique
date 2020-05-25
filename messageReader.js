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

function checkForNewMessages() {
    let lastChecked = fs.readFileSync("lastChecked.txt", "utf8");
    let lastCheckedInt = parseInt(lastChecked);
    let newFiles = [];
    fs.readdir(messageFolder, (err, directories) => {
        directories.forEach(function (directory) {
            fs.readdir((messageFolder + directory + "/"), (err, files) => {
                files.forEach(function (file) {
                    let lastModified = fs.statSync(messageFolder +
                        directory + "/" + file).mtimeMs;
                    if (lastModified > lastCheckedInt) {
                        newFiles.push(messageFolder + directory + "/" + file);
                    }
                });
            });
        });
    });
    function printMessages() {
        if (newFiles.length > 0) {
            newFiles.forEach(function (newFile) {
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
            if (newFiles.length === 1) {
                console.log("YOU HAVE ONE NEW MESSAGE." + "\n");
            } else if (newFiles.length >= 2) {
                console.log("YOU HAVE " + newFiles.length + " MESSAGES.");
            }
        } else {
            console.log(
                "\n" +
                "\n" +
                "NO NEW MESSAGES." + "\n");
        }
    }
    setDate();
    setTimeout(printMessages, 500);
    setTimeout(decisionTree, 750);
}

function listContacts() {
    let contacts = [];
    fs.readdir(messageFolder, (err, files) => {
        files.forEach(function (directory) {
            contacts.push(directory);
            console.log(directory);
        })
    });

    function selectContact() {
        rl.question("\n" +
            "ENTER CONTACT NAME OR LEAVE BLANK TO QUIT: ",
            function (contactName) {
                contactName = contactName.trim();
                if (contactName === "") {
                    decisionTree();
                } else {
                    if (!contacts.includes(contactName)) {
                        console.log(
                            "CONTACT NOT FOUND." +
                            "\n"
                        );
                        selectContact();
                    } else {
                        console.log("YOU CHOSE " + contactName + ".");
                        // Quit to menu for now.
                        decisionTree();
                    }
                };
            }
        );
    }
    setTimeout(selectContact, 500);
}

function startupWelcome() {
    console.log("WELCOME TO COMMUNIQUE.");
}

startupWelcome();

function aboutCommunique() {
    console.log(
        "\n" +
        "COMMUNIQUE" + "\n" +
        "\n" +
        "A MESSAGING TOOL FOR P2P FILE-SYNC PROGRAMS." + "\n" +
        "\u00A9 2020 NDH LTD." + "\n" +
        "CREATED BY NICHOLAS BERNHARD" + "\n" +
        "\n"
    );
    decisionTree();
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
    // Return to menu for now.
    decisionTree();
}

function signatureEditor() {
    rl.question(
        "\n" +
        "CREATE SIGNATURE, OR TYPE 'MENU' TO CANCEL: ",
        function (signature) {
            if (signature === "menu") {
                decisionTree();
            } else {
                fs.writeFile(
                    "messageSignature.txt", signature,
                    function (err) {
                        if (err) throw err;
                    }
                );
                console.log(
                    "\n" +
                    "\n" +
                    "SIGNATURE CREATED."
                );
                setTimeout(function () {
                    showSignature();
                    // This will go back to decisionTree
                }, 500);
            }
        });
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
    decisionTree();
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

function chat() {
    console.clear();
    // rl.question(
    //     "\n" +
    //     "CHAT WITH: ", function (receiver) {
    //         fs.readdir((messageFolder + receiver + "/"), (err, files) => {
    //             oldInboxLength = files.length;
    //         });
    //     }
    // )
}

function decisionTree() {
    rl.question("\n" +
        "WHAT WOULD YOU LIKE TO DO? ",
        function (response) {
            response = response.toLowerCase();
            switch (true) {
                case response === "check":
                    checkForNewMessages();
                    break;
                case response === "newsig":
                    signatureEditor();
                    break;
                case response === "sig":
                    showSignature();
                    break;
                case response === "menu":
                    decisionTree();
                    break;
                case response === "about":
                    aboutCommunique();
                    break;
                case response === "help":
                    communiqueHelp();
                    break;
                case response === "date":
                    setDate();
                    break;
                case response === "quit":
                    quitProgram();
                    break;
                case response === "contacts":
                    listContacts();
                    break;
                case response.slice(0, 4) === "chat":
                    chat();
                    break;
                default:
                    console.log(
                        "\n" +
                        "COMMAND NOT RECOGNIZED."
                    );
                    decisionTree();
            }
        }
    )
}

setTimeout(decisionTree, 1000);

function setDate() {

    let date = Date.now().toString();

    fs.writeFile(
        "lastChecked.txt", date,
        function (err) {
            if (err) throw err;
        }
    );

    // console.log("DATE SET: " + date);

    decisionTree();

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
}

// rl.on("close", function () {
//     quitProgram();
// });