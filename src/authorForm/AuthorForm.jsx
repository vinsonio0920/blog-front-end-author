const AuthorForm = () => {
  return (
    <form>
      <h1>Become an Author</h1>
      <p>To become an author, enter the secret code!</p>
      <div>
        <label htmlFor="code">Code</label>
        <input type="text" id="code" name="code" required maxLength="64" />
      </div>
      <button type="submit">Verify</button>
    </form>
  );
};

export { AuthorForm };
