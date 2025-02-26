package edu.icet.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/product")
public class ProductImageUpload {

    private String customImageName = "no-image-selected";

    @PostMapping("/get-product-code")
    public String printText(@RequestBody Map<String, String> request) {
        customImageName = request.get("text"); // Extract text from JSON request
        System.out.println("User Entered: " + customImageName); // Print to console
        return "Received: " + customImageName;
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public String uploadFile(@RequestParam("file") MultipartFile file){
//        String filePath = System.getProperty("user.dir") + "/Uploads" + File.separator + file.getOriginalFilename();

        // Generate a new file name
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")); // Get file extension
        String newFilename = customImageName + fileExtension; // Rename using timestamp

        String uploadDir = System.getProperty("user.dir") + "/Uploads";
        File directory = new File(uploadDir);

        // Ensure the directory exists
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Construct the new file path
        String filePath = uploadDir + File.separator + newFilename;
        String fileUploadStatus;

        // Try block to check exceptions
        try {

            // Creating an object of FileOutputStream class
            FileOutputStream fout = new FileOutputStream(filePath);
            fout.write(file.getBytes());

            // Closing the connection
            fout.close();
            fileUploadStatus = "File Uploaded Successfully";

        }

        // Catch block to handle exceptions
        catch (Exception e) {
            e.printStackTrace();
            fileUploadStatus =  "Error in uploading file: " + e;
        }
        return fileUploadStatus;
    }


    // Getting list of filenames that have been uploaded
    @RequestMapping(value = "/getFiles", method = RequestMethod.GET)
    public String[] getFiles()
    {
        String folderPath = System.getProperty("user.dir") +"/Uploads";

        // Creating a new File instance
        File directory= new File(folderPath);

        // list() method returns an array of strings
        // naming the files and directories
        // in the directory denoted by this abstract pathname
        String[] filenames = directory.list();

        // returning the list of filenames
        return filenames;

    }

    // Downloading a file
//    @RequestMapping(value = "/download/{path:.+}", method = RequestMethod.GET)
//    public ResponseEntity downloadFile(@PathVariable("path") String filename) throws FileNotFoundException {
//
//        // Checking whether the file requested for download exists or not
//        String fileUploadpath = System.getProperty("user.dir") +"/Uploads";
//        String[] filenames = this.getFiles();
//        boolean contains = Arrays.asList(filenames).contains(filename);
//        if(!contains) {
//            return new ResponseEntity("FIle Not Found", HttpStatus.NOT_FOUND);
//        }
//
//        // Setting up the filepath
//        String filePath = fileUploadpath+File.separator+filename;
//
//        // Creating new file instance
//        File file= new File(filePath);
//
//        // Creating a new InputStreamResource object
//        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
//
//        // Creating a new instance of HttpHeaders Object
//        HttpHeaders headers = new HttpHeaders();
//
//        // Setting up values for contentType and headerValue
//        String contentType = "application/octet-stream";
//        String headerValue = "attachment; filename=\"" + resource.getFilename() + "\"";
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.parseMediaType(contentType))
//                .header(HttpHeaders.CONTENT_DISPOSITION, headerValue)
//                .body(resource);
//
//    }

    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String filename) throws FileNotFoundException {
        // Define the upload directory
        String fileUploadPath = System.getProperty("user.dir") + "/Uploads";
        File file = new File(fileUploadPath + File.separator + filename);

        // Check if file exists
        if (!file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Read file as resource
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        // Set Content-Type dynamically
        String contentType = "application/octet-stream"; // Default binary type
        try {
            contentType = Files.probeContentType(file.toPath());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
