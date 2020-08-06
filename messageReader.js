function newMessage(messageRecipient) {
    fs.readdir(messageFolder, (err, files) => {
        function loopFiles(file, fileIndex) {
            files[fileIndex] = files[fileIndex].replace("_", "");
            files[fileIndex] = files[fileIndex].replace(masterUsername, "");
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
                                        let folderName1 = masterUsername +
                                            "_" + messageRecipient;
                                        let folderName2 = messageRecipient +
                                            "_" + masterUsername;
                                        let messageDestination = "./" +
                                            "messages/" + folderName1 +
                                            "/from_" + masterUsername + "/";
                                        if (
                                            !fs.existsSync(messageDestination)
                                        ) {
                                            messageDestination = "./" +
                                                "messages/" + folderName2 +
                                                "/from_" + masterUsername + "/";
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

        i