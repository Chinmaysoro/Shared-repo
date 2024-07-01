import { Hook, HookContext } from '@feathersjs/feathers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const uploadImage =
  (): Hook =>
    async (context: HookContext): Promise<HookContext> => {
      let { app, params, data } = context;

      const file = params.files;
      const config = app.get('aws');

      const s3 = new S3Client({
        region: 'ap-south-1',
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
      });

      console.log(file)
      // Ensure data is not mutated directly
      const originalname = new Date().getTime() + '_' + file.originalname;

      try {
        const uploadParams = {
          Bucket: config.bucket,
          Key: originalname,
          ACL: 'private',
          ContentType: file.mimetype,
          Body: file.buffer,
        };

        // Upload the file to S3 using PutObjectCommand
                      // @ts-ignore
        const result = await s3.send(new PutObjectCommand(uploadParams));

        // Update the context data with the necessary information
        data.originalName = originalname;
                      // @ts-ignore
        data.link = result.Location;
        data.size = file.size;

        return context;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to upload the image to AWS S3.');
      }
    };

export default uploadImage;
