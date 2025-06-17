import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      padding: 24px;
    `,
    listStyle: css`
      margin: 0;
      padding-left: 20px;
    `,
    formContainer: css`
      width: 100%;
    `,
  };
});

export default useStyles; 