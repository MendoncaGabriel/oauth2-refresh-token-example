const authenticateClient = ({clientId, clientSecret}) => {
  const clients = [
    { id: 'client1', secret: 'secret123', scopes: ['read:user', 'write:user'] },
    { id: 'client2', secret: 'secret456', scopes: ['read:user'] },
  ];

  return clients.find(
    client => client.id === clientId && client.secret === clientSecret
  );
}

export { authenticateClient }