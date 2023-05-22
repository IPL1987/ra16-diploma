import PropTypes from 'prop-types';
import Contacts from '../../components/footer/Contacts/contacts';
import Copyright from '../../components/footer/Copyright/copyright';
import PayInfo from '../../components/footer/PayInfo/payInfo';
import { FootMenu } from '../../components/shared/Menu/menu';
import './main.css';

const Footer = ({ menu, payData, contacts }) => (
  <footer className="container bg-light footer">
    <div className="row">
      <div className="col">
        <section>
          <h5>Информация</h5>
          <FootMenu menu={menu} />
        </section>
      </div>
      <div className="col">
        <PayInfo payData={payData} />
        <Copyright />
      </div>
      <div className="col text-right">
        <Contacts data={contacts} />
      </div>
    </div>
  </footer>);

Footer.propTypes = {
  linkTo: PropTypes.string
};

export default Footer;