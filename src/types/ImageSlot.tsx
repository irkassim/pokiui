export interface ImageSlot {
  id: number;       // Temporary grid ID (can be -1 for empty slots)
  _id?: string;     // Backend-provided unique identifier
  src: string;
        // Image source URL
  //signedUrl?: string; // Si
  }

  export interface UploadResponse {
    imageId: number;
    success: boolean;
    imageUrl: string;
    error:string;
    
    publicPhotos?: Array<{
      id: number;
      _id:number;
      signedUrl: string;
      src:string;
    }>;
  }