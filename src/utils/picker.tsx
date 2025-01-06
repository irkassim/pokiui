

const pickFile = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*'; // Restrict to images
      input.onchange = () => {
        if (input.files && input.files[0]) {
          resolve(input.files[0]); // Return the selected file
        } else {
          reject(new Error('No file selected'));
        }
      };
      input.click(); // Open the file dialog
    });
  };

  export default  pickFile;
  