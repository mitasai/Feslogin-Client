import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ConstantList from "../../appConfig";
const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class METLanguageSelect extends React.Component {


  state = {
    selected: 'en',
    hasError: false
  };

  componentDidMount = () => {
    let language = localStorage.getItem('language')
      ? localStorage.getItem('language')
      : 'en'
    this.props.i18n.changeLanguage(language)
    this.setState({
      selected: language,
    })
  }

  handleChange(value) {
    //alert(t('description.part1'));
    const { t, i18n, classes } = this.props;
    i18n.changeLanguage(value);
    this.setState({ selected: value });
    localStorage.setItem('language',value)
  }
  render() {
    const { t, i18n, classes } = this.props;
    const { selected, hasError } = this.state;
    return (
      <div className="nav-link">
        <img className="img-fluid"     src={
                      selected == "vi"
                        ? ConstantList.ROOT_PATH + "assets/homepage/flag_vn.png"
                        : ConstantList.ROOT_PATH + "assets/homepage/flag_en.png"
                    }  alt="" />&nbsp;
        {/* <img className="img-fluid" src="/assets/homepage/flag_us.png" alt="" />&nbsp; */}
        <span className={"cursor-pointer select-language" + (selected =="vi"? "fw-bold select-language":"") } onClick={event => this.handleChange("vi")} >VI</span>&nbsp;<span className="text-white select-language">|</span> <span className={"cursor-pointer select-language" + (selected=="en"?"fw-bold select-language":"") } onClick={event => this.handleChange("en")} >EN</span>
      </div>
      // <form className={classes.root} autoComplete="off">
      //   <FormControl className={classes.formControl} error={hasError}>
      //     <InputLabel htmlFor="name">{t('general.language')}</InputLabel>
      //     <Select
      //       name="name"
      //       value={selected}
      //       onChange={event => this.handleChange(event.target.value)}
      //       input={<Input id="name" />}
      //     >
      //       <MenuItem value="vi">Tiếng Việt</MenuItem>
      //       {/* <MenuItem value="de">Deutsch</MenuItem> */}
      //       <MenuItem value="en">English</MenuItem>
      //     </Select>
      //     {hasError && <FormHelperText>This is required!</FormHelperText>}
      //   </FormControl>
      // </form>
    );
  }
}

METLanguageSelect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(METLanguageSelect);
