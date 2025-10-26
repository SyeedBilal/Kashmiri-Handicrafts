const { SecretsManagerClient, GetSecretValueCommand }=require("@aws-sdk/client-secrets-manager");

const secret_name = "Kash-Handi-Secrets";

const client = new SecretsManagerClient({
  region: "ap-south-1",
});

 const getSecrets = async () => {
  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
      })
    );

    const secretString = response.SecretString;
    const secrets = JSON.parse(secretString); // Converts the JSON into an object
    return secrets;
  } catch (error) {
    console.error("Error fetching secrets:", error);
    throw error;
  }
};




const loadSecrets = async () => {
  const secrets = await getSecrets();

  // Set them as environment variables
  for (const [key, value] of Object.entries(secrets)) {
    process.env[key] = value;
  }

  console.log("✅ AWS Secrets loaded successfully");
};

module.exports=loadSecrets;
