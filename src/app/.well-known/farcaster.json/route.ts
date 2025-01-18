import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_URL || `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOiA4ODcyNDYsICJ0eXBlIjogImN1c3RvZHkiLCAia2V5IjogIjB4N0Q0MDBGRDFGNTkyYkI0RkNkNmEzNjNCZkQyMDBBNDNEMTY3MDRlNyJ9",
      payload: "eyJkb21haW4iOiAicm9hZHUtdm90ZXdhdGNoZXJkYW8udmVyY2VsLmFwcCJ9",
      signature: "MHgyNjJkMDJhZTE1YmEwMmI2ZThkM2ZlMDhkNzhkMDM5ZjA2YzJhODkwOGI0ZTZiNzZmYmMzODI5YzllZDQ3NTc5NzI5OGU0ZjY1MGJhYWE5YzhlYTQ5ZWQ1ZmI4ZmE3OGZkYzFlNzkxM2NjMzhmZTcyNWFjNDI2NTU2MGJmOGRmNTFi"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/frames/hello/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
