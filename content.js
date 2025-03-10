async function fetchDefinition(word) {
    try {
        let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) throw new Error("Definition not found");

        let data = await response.json();

        let meaning = "No definition available.";
        let example = "No example available.";

        // Go through all meanings and definitions to find the first valid one
        for (let meaningObj of data[0]?.meanings || []) {
            for (let definitionObj of meaningObj.definitions || []) {
                if (definitionObj.definition) {
                    meaning = definitionObj.definition;
                }
                if (definitionObj.example) {
                    example = definitionObj.example;
                }
                if (meaning !== "No definition available.") break; // Stop if we found a valid definition
            }
            if (meaning !== "No definition available.") break; // Stop if we found a valid definition
        }

        return { word, meaning, example };
    } catch (error) {
        console.error("Error fetching definition:", error);
        return { word, meaning: "No definition found.", example: "No example available." };
    }
}

document.addEventListener("mouseup", async (event) => {
    let selectedText = window.getSelection().toString().trim();

    if (selectedText && selectedText.split(" ").length <= 3) {  // Ensure it's a word or short phrase
        let definitionData = await fetchDefinition(selectedText);
        if (definitionData) {
            showPopup(event.pageX, event.pageY, definitionData);
        }
    }
});

function showPopup(x, y, { word, meaning, example }) {
    let existingPopup = document.getElementById("hover-dictionary-popup");
    if (existingPopup) existingPopup.remove();

    let popup = document.createElement("div");
    popup.id = "hover-dictionary-popup";
    popup.innerHTML = `
        <strong>${word}</strong><br>
        📝 <b>Definition:</b> ${meaning}<br>
        ✍️ <b>Example:</b> <i>${example}</i>
    `;

    document.body.appendChild(popup);

    popup.style.left = `${x + 10}px`;
    popup.style.top = `${y + 10}px`;

    setTimeout(() => {
        popup.remove();
    }, 10000);  // Auto remove after 10 seconds
}
