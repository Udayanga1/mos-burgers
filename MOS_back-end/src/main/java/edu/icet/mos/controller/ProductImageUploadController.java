package edu.icet.mos.controller;

import edu.icet.mos.service.ProductImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductImageUploadController {
    final ProductImageUploadService service;
    private String customImageName = "no-image-selected";

    @PostMapping("/get-product-code")
    public String printText(@RequestBody Map<String, String> request) {
        customImageName = request.get("text"); // Extract text from JSON request
        System.out.println("User Entered: " + customImageName); // Print to console
        return "Received: " + customImageName;
    }

    @PostMapping("/upload")
    public void uploadFile(@RequestParam("file") MultipartFile file){

//        service.upload(file);
        // Generate a new file name
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")); // Get file extension
        String newFilename = customImageName + fileExtension; // Rename the file

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
//        return fileUploadStatus;
    }


    // Getting list of filenames that have been uploaded
    @RequestMapping(value = "/getFiles", method = RequestMethod.GET)
    public String[] getFiles()
    {
        String folderPath = System.getProperty("user.dir") +"/Uploads";

        // Creating a new File instance
        File directory= new File(folderPath);

        String[] filenames = directory.list();

        return filenames;

    }


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
