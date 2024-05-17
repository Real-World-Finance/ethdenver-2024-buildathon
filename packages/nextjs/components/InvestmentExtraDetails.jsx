function ExtraDetails() {
  return (
    <div className="bg-white shadow-xl rounded-lg ">
      <h2 className="font-semibold text-2xl mb-4">OUSG Details</h2>
      <p className="text-gray-700 mb-4">
        Dive deep into the specifics of the OUSG product, understand its workings, and explore its unique features.
      </p>
      <div className="mb-4">
        <h3 className="font-semibold text-xl">Key Features</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Decentralized Finance Integration</li>
          <li>High Yield Returns</li>
          <li>Stablecoin Compatibility</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-xl">Investment Strategy</h3>
        <p className="text-gray-600">
          The investment strategy focuses on maximizing returns through diversified portfolios, leveraging DeFi
          protocols, and ensuring security and transparency.
        </p>
      </div>
    </div>
  );
}

export default ExtraDetails;
