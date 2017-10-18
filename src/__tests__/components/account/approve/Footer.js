import React from 'react';
import { shallow } from 'enzyme';
import Footer from '../../../../components/accounts/approve/Footer';

const props = {
  approved: false,
  close: jest.fn(),
  approve: jest.fn(),
  aborting: jest.fn(),
};

const approveProps = { ...props, approved: true };

describe('Footer account approve component', () => {
  afterEach(() => {
    props.close.mockReset();
    props.approve.mockReset();
    props.aborting.mockReset();
  });

  /* testing approved case */
  describe('Approved case', () => {
    it('should be a .footer', () => {
      const wrapper = shallow(<Footer {...approveProps} />);
      expect(wrapper.prop('className')).toBe('footer');
    });

    it('.footer should have a DialogButton .cancel', () => {
      const wrapper = shallow(<Footer {...approveProps} />);
      expect(wrapper.find('DialogButton').prop('className')).toBe('cancel');
    });

    it('DialogButton should have onTouchTap binded to close()', () => {
      const wrapper = shallow(<Footer {...approveProps} />);
      const DialogButton = wrapper.find('DialogButton');
      DialogButton.simulate('touchTap');
      expect(approveProps.close).toHaveBeenCalled();
    });
  });

  /* testing not approved case */
  describe('Approved case', () => {
    it('should be a .footer', () => {
      const wrapper = shallow(<Footer {...props} />);
      expect(wrapper.prop('className')).toBe('footer');
    });

    it('.footer should have a first DialogButton cancel', () => {
      const wrapper = shallow(<Footer {...props} />);
      const First = wrapper.find('DialogButton').at(0);

      First.simulate('touchTap');
      expect(props.close).toHaveBeenCalled();
    });

    it('should have a div with float: right style containing 2 dialogbutton', () => {
      const wrapper = shallow(<Footer {...props} />);
      const Div = wrapper.children().find('div');

      // expect(Div.html().match(/style="([^"]*)"/i)[1]).toBe('float:right;');
      expect(Div.find('DialogButton').length).toBe(2);
    });

    it('first float right DialogButton should be .abort.margin and binded to aborting()', () => {
      const wrapper = shallow(<Footer {...props} />);
      const Div = wrapper.children().find('div');
      const First = Div.find('DialogButton').at(0);

      expect(First.prop('className')).toBe('abort margin');
      First.simulate('touchTap');
      expect(props.aborting).toHaveBeenCalled();
    });

    it('second float right DialogButton should be binded to approve()', () => {
      const wrapper = shallow(<Footer {...props} />);
      const Div = wrapper.children().find('div');
      const First = Div.find('DialogButton').at(1);

      First.simulate('touchTap');
      expect(props.approve).toHaveBeenCalled();
    });
  });
});
