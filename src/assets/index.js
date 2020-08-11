

 // index.js
 const { BlobServiceClient } = require("@azure/storage-blob");
 // Now do something interesting with BlobServiceClient
 
const createContainerButton = document.getElementById("create-container-button");
const deleteContainerButton = document.getElementById("delete-container-button");
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");
const listButton = document.getElementById("list-button");
const deleteButton = document.getElementById("delete-button");
const status = document.getElementById("status");
const fileList = document.getElementById("file-list");

const reportStatus = message => {
    status.innerHTML += `${message}<br/>`;
    status.scrollTop = status.scrollHeight;
}

 // Update <placeholder> with your Blob service SAS URL string
 const blobSasUrl = "https://testblogstorageaccount.blob.core.windows.net/?sv=2019-12-12&ss=b&srt=sco&sp=rwdlacx&se=2020-10-31T18:19:40Z&st=2020-08-02T10:19:40Z&spr=https&sig=k3Rq9OBEKL3YQ80ipt2V6BBx8CCysNLzcTeRsHCmqZ0%3D";
 
 // Create a new BlobServiceClient
 const blobServiceClient = new BlobServiceClient(blobSasUrl);
 
 // Create a unique name for the container by 
 // appending the current time to the file name
 const containerName = "files";
 
 // Get a container client from the BlobServiceClient
 const containerClient = blobServiceClient.getContainerClient(containerName);
 
 const createContainer = async () => {
     try {
         reportStatus(`Creating container "${containerName}"...`);
         await containerClient.create();
         reportStatus(`Done.`);
     } catch (error) {
         reportStatus(error.message);
     }
 };
 
 const deleteContainer = async () => {
     try {
         reportStatus(`Deleting container "${containerName}"...`);
         await containerClient.delete();
         reportStatus(`Done.`);
     } catch (error) {
         reportStatus(error.message);
     }
 };
 
 createContainerButton.addEventListener("click", createContainer);
 deleteContainerButton.addEventListener("click", deleteContainer);
 
 const listFiles = async () => {
     fileList.size = 0;
     fileList.innerHTML = "";
     try {
         reportStatus("Retrieving file list...");
         let iter = containerClient.listBlobsFlat();
         let blobItem = await iter.next();
         while (!blobItem.done) {
             fileList.size += 1;
             fileList.innerHTML += `<option>${blobItem.value.name}</option>`;
             blobItem = await iter.next();
         }
         if (fileList.size > 0) {
             reportStatus("Done.");
         } else {
             reportStatus("The container does not contain any files.");
         }
     } catch (error) {
         reportStatus(error.message);
     }
 };
 
 listButton.addEventListener("click", listFiles);
 
 
 const uploadFiles = async () => {
     try {
         reportStatus("Uploading files...");
         const promises = [];
         for (const file of fileInput.files) {
             const blockBlobClient = containerClient.getBlockBlobClient(file.name);
             promises.push(blockBlobClient.uploadBrowserData(file));
         }
         await Promise.all(promises);
         reportStatus("Done.");
         listFiles();
     }
     catch (error) {
             reportStatus(error.message);
     }
 }
 
 selectButton.addEventListener("click", () => fileInput.click());
 fileInput.addEventListener("change", uploadFiles);
 
 const deleteFiles = async () => {
     try {
         if (fileList.selectedOptions.length > 0) {
             reportStatus("Deleting files...");
             for (const option of fileList.selectedOptions) {
                 await containerClient.deleteBlob(option.text);
             }
             reportStatus("Done.");
             listFiles();
         } else {
             reportStatus("No files selected.");
         }
     } catch (error) {
         reportStatus(error.message);
     }
 };
 
 deleteButton.addEventListener("click", deleteFiles);
 
 