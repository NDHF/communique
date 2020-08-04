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

const messageFolder = "./messages/";
const fs = require('fs');
const readline = require("readline");
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function listContacts() {
    let usrnm4contacts = fs.readFileSync(
        "username.txt", "utf-8"
    );
    fs.readdir(messageFolder, (err, files) => {
        console.log(
            "\n" +
            "HERE ARE THE CONTACTS IN YOUR FOLDER: " +
            "\n"
        );
        files.forEach(function (directory) {
            let justContactName = directory.replace("_", "");
            justContactName = justContactName.replace(usrnm4contacts, "");
            console.log(justContactName);
        });
        decisionTree();
    });
}

function startupWelcome() {
    console.log(
        "\n" +
        "WELCOME TO COMMUNIQUE." +
        "\n"
        // "====  ====  |\\ /|  |\\ /|  |  |" +
        // "\n" +
        // "||    |  |  | | |  | | |  |  |" +
        // "\n" +
        // "||    |  |  | | |  | | |  |  |" +
        // "\n" +
        // "====  ====  | | |  | | |  \\_//"
    );
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

function howToUseCommunique() {
    console.log("nothing yet!");
}

function communiqueHelp() {
    console.log(
        "HELP TOPICS:" + "\n"
    );
    let helpTopics = [
        "COMMANDS", "SEARCH", "HOW TO USE", "OTHER STUFF", "BACK"
    ];
    helpTopics.forEach(function (item) {
        console.log(item);
    });
    rl.question(
        "\n" +
        "WHAT WOULD YOU LIKE HELP WITH? ",
        function (response) {
            response = response.toLowerCase().trim();
            switch (true) {
                case response === "commands":
                    showCommands("fromHelp");
                    break;
                case response === "other stuff":
                    console.log('nothing to show yet');
                    decisionTree();
                case response === "back":
                    decisionTree();
                default:
                    console.log("INPUT NOT RECOGNIZED.");
                    decisionTree();
            }
        }
    )
}

function addSignature(yesOrNo, returnToMenu) {
    yesOrNo = yesOrNo.toLowerCase();
    if ((yesOrNo !== "yes") && (yesOrNo !== "no")) {
        console.log("VALUE CAN EITHER BE 'ON' OR 'OFF'");
        decisionTree();
    } else {
        fs.writeFile(
            "signatureStatus.txt", yesOrNo,
            function (err) {
                if (err) throw err;
            }
        );
        if (yesOrNo === "yes") {
            console.log(
                "\n" +
                "SIGNATURE WILL BE ADDED TO MESSAGES."
            );
        } else if (yesOrNo === "no") {
            console.log(
                "\n" +
                "SIGNATURE WILL NO LONGER BE ADDED TO MESSAGES."
            );
        }
        if (returnToMenu === "returnToMenu") {
            decisionTree();
        }
    }
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
                rl.question(
                    "\n" +
                    "ADD SIGNATURE AUTOMATICALLY (YES OR NO)? ",
                    function (yesOrNo) {
                        addSignature(yesOrNo);
                        setTimeout(function () {
                            showSignature();
                            // This will go back to decisionTree
                        }, 500);
                    });
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

function newMessage(messageRecipient) {
    let usrnm4msg = fs.readFileSync(
        "username.txt", "utf-8"
    );
    fs.readdir(messageFolder, (err, files) => {
        function loopFiles(file, fileIndex) {
            files[fileIndex] = files[fileIndex].replace("_", "");
            files[fileIndex] = files[fileIndex].replace(usrnm4msg, "");
        }
        files.forEach(loopFiles);
        if (!files.includes(messageRecipient)) {
            console.log("CONTACT NOT FOUND.");
            decisionTree();
        } else {
            rl.question(
                "\n" +
                "WRITE YOUR MESSAGE HERE, OR TYPE 'BACK'" +
                "TO RETURN TO MENU: ",
                function (message) {
                    if (message.toLowerCase() === "back") {
                        decisionTree();
                    } else {
                        let addSignatureToMessage = fs.readFileSync(
                            "signatureStatus.txt", "utf-8"
                        );
                        console.log(
                            "\n" +
                            "ADD SIGNATURE TO MESSAGE: " +
                            addSignatureToMessage);
                        if ((addSignatureToMessage !== "yes") &&
                            (addSignatureToMessage !== "no")) {
                            console.log("THERE WAS AN ERROR IN DETERMINING " +
                                "WHETHER OR NOT TO ADD A SIGNATURE " +
                                "TO THE MESSAGE." +
                                "\n" +
                                "THE CONTENTS OF THE FILE " +
                                "signatureStatus.txt " +
                                "SHOULD EITHER BE 'yes' OR 'no'" +
                                "\n");
                        } else {
                            if (addSignatureToMessage === "yes") {
                                let signatureToAdd = fs.readFileSync(
                                    "messageSignature.txt", "utf-8"
                                );
                                message = message.concat(
                                    "\n" +
                                    "\n" +
                                    signatureToAdd
                                );
                            }
                        }
                        console.log(
                            "\n" +
                            "YOUR MESSAGE TO " + messageRecipient + ": " +
                            "\n" +
                            "\n" +
                            message
                        );

                        function sendMessageQuestion() {
                            rl.question(
                                "\n" +
                                "DO YOU WANT TO SEND THIS MESSAGE " +
                                "(YES OR NO)? ",
                                function (yesOrNo) {
                                    yesOrNo = yesOrNo.toLowerCase();
                                    if ((yesOrNo !== "yes") &&
                                        (yesOrNo !== "no")) {
                                        sendMessageQuestion();
                                    } else if (yesOrNo === "no") {
                                        newMessage(messageRecipient);
                                    } else if (yesOrNo === "yes") {
                                        let folderName1 = usrnm4msg +
                                            "_" + messageRecipient;
                                        let folderName2 = messageRecipient +
                                            "_" + usrnm4msg;
                                        let messageDestination = "./" +
                                            "messages/" + folderName1 +
                                            "/from_" + usrnm4msg + "/";
                                        if (
                                            !fs.existsSync(messageDestination)
                                        ) {
                                            messageDestination = "./" +
                                                "messages/" + folderName2 +
                                                "/from_" + usrnm4msg + "/";
                                        }
                                        let newDate = new Date();
                                        let dateInMs = newDate.getTime();
                                        fs.writeFile(
                                            messageDestination +
                                            "communique_to_" +
                                            messageRecipient +
                                            "_" + dateInMs +
                                            ".txt", message,
                                            function (err) {
                                                if (err) throw err;
                                            }
                                        );
                                        console.log(
                                            "\n" +
                                            "MESSAGE SENT TO: " +
                                            messageDestination +
                                            "\n"
                                        );
                                        decisionTree();
                                    }
                                }
                            );
                        }
                        sendMessageQuestion();
                    }
                });
        }
    });
}

function searchMessages(toOrFrom, target, range, rangeTwo) {

    let usrnm4search = fs.readFileSync(
        "username.txt", "utf-8"
    );

    let folderToSearch = "";
    let subFolderToSearch = "";

    function searchFolder(rangeType) {
        // FIRST, SORT THE FOLDER
        // https://stackoverflow.com/a/40189439
        let finalPath = (
            messageFolder + folderToSearch + "/" +
            subFolderToSearch + "/"
        );
        fs.readdir(finalPath, function (err, files) {
            files = files.map(function (fileName) {
                    return {
                        name: fileName,
                        time: fs.statSync(finalPath + fileName).mtime.getTime()
                    };
                })
                .sort(function (a, b) {
                    return a.time - b.time;
                })
                .map(function (v) {
                    return v.name;
                });
            if (rangeType === "last") {
                let lastFile = fs.readFileSync(finalPath +
                    files[files.length - 1], "utf-8");
                console.log(
                    "\n" +
                    "MOST-RECENT MESSAGE IN THIS FOLDER: " +
                    "\n" +
                    "\n" +
                    "***************" +
                    "\n"
                );
                console.log(lastFile);
                console.log(
                    "\n" +
                    "***************"
                );
                decisionTree();
            } else {
                console.log("NOT SET UP YET.");
            }
        });
    }

    function applyRange() {
        function validateDate(dateString) {
            let correctLength = (dateString.length === 10);
            let correctHyphenPositions = (
                (dateString.substr(4, 1) === "-") &&
                (dateString.substr(7, 1) === "-")
            );
            let dateAttempt = new Date(dateString);
            let dateParses = (!Number.isNaN(dateAttempt.getTime()));
            let validDate = (correctLength && correctHyphenPositions &&
                dateParses);
            return validDate;
        }

        function badDatePrompt() {
            rl.question(
                "\n" +
                "UNABLE TO PROCESS THE DATE RANGES." +
                "\n" +
                "USE THE FOLLOWING FORMAT: YYYY-MM-DD" +
                "\n" +
                "NEW DATE RANGE (OR TYPE 'BACK' TO RETURN TO MAIN MENU): ",
                function (bdpResponse) {
                    bdpResponse = bdpResponse.trim();
                    if (bdpResponse.toLowerCase() === "back") {
                        decisionTree();
                    } else {
                        bdpResponse = bdpResponse.split(" ");
                        searchMessages(
                            toOrFrom, target, bdpResponse[0], bdpResponse[1]
                        );
                    }
                }
            )
        }
        if (range === undefined) {
            searchFolder("last");
        } else if ((range !== undefined) && (rangeTwo === undefined)) {
            if (!validateDate(range)) {
                if (Number.isNaN(parseInt(range))) {
                    badDatePrompt();
                } else {
                    searchFolder("number");
                }
            } else {
                searchFolder("oneRange");
            }
        } else if ((range !== undefined) && (rangeTwo !== undefined)) {
            // console.log("TWO RANGES SPECIFIED");
            if (((!validateDate(range)) && (!validateDate(rangeTwo)) ||
                    (validateDate(range)) && (!validateDate(rangeTwo))) ||
                (!validateDate(range)) && (validateDate(rangeTwo))) {
                badDatePrompt();
            } else {
                searchFolder("twoRanges");
            }
        }
    }

    function checkForSubFolder() {

        let un = fs.readFileSync("username.txt", "utf-8");

        let sf = "";

        if (toOrFrom === "to") {
            sf = "from_" + un;
        } else if (toOrFrom === "from") {
            sf = "from_" + target;
        } else {
            console.log("SOMETHING WENT WRONG IN DETERMINING WHETHER " +
                "TO LOOK IN 'TO' OR 'FROM' SUB-FOLDER.");
        }

        if (fs.existsSync(messageFolder + folderToSearch + "/" +
                sf + "/")) {
            subFolderToSearch = sf;
            applyRange();
        } else {
            console.log(
                "\n" +
                "COMMUNIQUE LOOKED FOR A FOLDER NAMED '" +
                sf + "', BUT COULD NOT FIND IT."
            );
            decisionTree();
        }
    }

    function checkSearchTarget() {
        fs.readdir(messageFolder, (err, files) => {
            let listOfContacts = [];
            files.forEach(function (directory) {
                let cn = directory.replace("_", "");
                cn = cn.replace(usrnm4search, "");
                listOfContacts.push(cn);
            });
            if (!listOfContacts.includes(target)) {
                console.log(
                    "'" + target + "' WAS NOT FOUND IN YOUR CONTACTS." +
                    "\n"
                );
                rl.question("ENTER A NEW CONTACT, " +
                    "\n" +
                    "OR TYPE 'BACK' TO RETURN TO MENU: ",
                    function (response) {
                        if (response.toLowerCase() === "back") {
                            decisionTree();
                        } else {
                            searchMessages(
                                toOrFrom, response, range, rangeTwo
                            );
                        }
                    });
            } else {
                folderToSearch = files[listOfContacts.indexOf(target)];
                checkForSubFolder();
            }

        });
    }

    function checkToOrFrom() {
        toOrFrom = toOrFrom.toLowerCase();
        if ((toOrFrom !== "to") && (toOrFrom !== "from")) {
            function askToOrFromAgain() {
                rl.question(
                    "\n" +
                    "ARE YOU SEARCHING FOR MESSAGES TO SOMEONE, " +
                    "OR FROM SOMEONE (TO/FROM)? ",
                    function (replyToToOrFrom) {
                        replyToToOrFrom = replyToToOrFrom.toLowerCase();
                        if ((replyToToOrFrom !== "to") &&
                            (replyToToOrFrom !== "from")) {
                            askToOrFromAgain();
                        } else {
                            searchMessages(
                                replyToToOrFrom, target, range, rangeTwo
                            );
                        }
                    }
                );
            }
            askToOrFromAgain();
        } else if ((toOrFrom === "to") || (toOrFrom === "from")) {
            checkSearchTarget();
        } else {
            console.log(
                "AN ERROR OCCURED WHEN CHECKING WHETHER " +
                "YOU WERE SEARCHING MESSAGES TO YOU, OR MESSAGES FROM YOU." +
                "\n" +
                "\n"
            );
            quitProgram();
        }
    }
    checkToOrFrom();
    // console.log("nothing yet!");
    // decisionTree();
}

function showCommands(fromHelp) {
    console.log(
        "\n" +
        "COMMUNIQUE RECOGNIZES THE FOLLOWING COMMANDS: " +
        "\n"
    );
    let commandList = [{
            command: "CHECK",
            explanation: "CHECK FOR NEW MESSAGES"
        },
        {
            command: "NEWSIG",
            explanation: "CREATE A NEW SIGNATURE"
        },
        {
            command: "SIG",
            explanation: "SHOW SIGNATURE"
        },
        {
            command: "MENU",
            explanation: "GO BACK TO MAIN MENU"
        },
        {
            command: "ABOUT",
            explanation: "LEARN MORE ABOUT COMMUNIQUE"
        },
        {
            command: "HELP",
            explanation: "HELP WITH COMMANDS, OTHER ISSUES"
        },
        {
            command: "DATE",
            explanation: "SET DATE"
        },
        {
            command: "QUIT",
            explanation: "QUIT PROGRAM"
        },
        {
            command: "CONTACTS",
            explanation: "SHOW ALL CONTACTS"
        },
        {
            command: "CHAT",
            explanation: "IN-DEVELOPMENT"
        },
        {
            command: "COMMANDS",
            explanation: "SHOW A FULL LIST OF COMMANDS"
        },
        {
            command: "AUTOSIG",
            explanation: "CHOOSE WHETHER TO ADD SIGNATURE AUTOMATICALLY"
        },
        {
            command: "SEARCH",
            explanation: "SEARCH MESSAGES:" +
                "\n" +
                "\t SEARCH ['TO' OR 'FROM'] [RECIPIENT/SENDER OF MESSAGES] " +
                "[range]" +
                "\n" +
                "\t WILL AUTOMATICALLY SHOW LAST FIVE MESSAGES." +
                "\n" +
                "\t SEE 'HELP' FOR INFORMATION ON DESIGNATING A SEARCH RANGE." +
                "\n"
        },
        {
            command: "SET USERNAME",
            explanation: "SPECIFY USERNAME " +
                "\n" +
                "\t YOU MUST HAVE A USERNAME TO USE COMMUNIQUE."
        }
    ];

    function listCommandAndExplanation(commandListItem) {
        console.log(
            "* " + commandListItem.command +
            "\n" +
            "\t" + commandListItem.explanation +
            "\n"
        );
    }
    commandList.forEach(listCommandAndExplanation);
    if (fromHelp === "fromHelp") {
        communiqueHelp();
    } else {
        decisionTree();
    }
}

function setUsername(username) {
    rl.question("WHAT WOULD YOU LIKE YOUR USERNAME TO BE?" +
        "\n" +
        "OR, TYPE 'BACK' TO RETURN TO THE MENU. " +
        "\n" +
        "(WARNING: FURTHER CHANGES MAY CAUSE ERRORS) ",
        function (usernameInput) {
            if (usernameInput.toLowerCase() === "back") {
                decisionTree();
            } else {
                fs.writeFileSync("username.txt", usernameInput);
                console.log(
                    "\n" +
                    "USERNAME SET AS '" + usernameInput + "'." +
                    "\n" +
                    "");
                decisionTree();
            }
        });
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
                case response === "commands":
                    showCommands();
                    break;
                case response.slice(0, 6) === "newmsg":
                    newMessage(response.slice(7));
                    break;
                case response.slice(0, 6) === "search":
                    let sSp = response.split(" ");
                    searchMessages(sSp[1], sSp[2], sSp[3], sSp[4]);
                    break;
                case response === "autosig":
                    rl.question(
                        "\n" +
                        "AUTOMATICALLY ADD SIGNATURE (YES OR NO)? ",
                        function (yesOrNo) {
                            addSignature(yesOrNo, "returnToMenu");
                        }
                    );
                    break;
                case response === "set username":
                    setUsername();
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