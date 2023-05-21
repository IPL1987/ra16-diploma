import Banner from '../../components/main/Banner/banner';

const Main = ({ children }) => (
  <main className="container">
    <div className="row">
      <div className="col">
        <Banner />
        {children}
      </div>
    </div>
  </main>
);

export default Main;