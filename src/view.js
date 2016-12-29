
module.exports = (ctrl, { forEach, when }) =>

<jsx scrollTop={ctrl.scrollTop}>

  {{
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      margin: '0px',
      padding: '0px'
    }
  }}

  {
    // Logo
  }

  <div style={{height: '200px',overflow: 'hidden',background: `url('dist/bg.png')`}}>
    <div>

      {{
        style: {
          height: '100%',
          backgroundImage: 'url("branding/logo.svg")',
          backgroundPosition: 'center 35px',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }
      }}

    </div>
  </div>

  {
    forEach(ctrl.samples,(sample, i) =>

      <jsx>
        <div>

          {{
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'center',
              margin: '25px 0px'
            }
          }}

          <div style={{flexGrow: 1,margin: '25px', maxWidth: '750px'}}>
            <div>

              { forEach(Object.keys(sample.code.files),file =>
                <div onclick={e => sample.code.selected.set(file)} style={{display: 'inline-block', padding: '10px',userSelect: 'none'}}>

                  {
                    when(sample.code.selected.is(file),{
                      style: {
                        cursor: 'default',
                        backgroundColor: '#282c34',
                        color: '#dedede'
                      }
                    }).else({
                      style: {
                        cursor: 'pointer',
                        backgroundColor: 'white',
                        color: 'black'
                      }
                    })
                  }

                  {file}
                </div>
              ) }

            </div>
            <div>{{innerHTML: sample.code.selected.to(file => sample.code.files[file])}}</div>
          </div>

          <div>

            {{
              style: {
                margin: '25px',
                marginTop: 'calc(1.15em + 45px)',
                padding: '20px',
                border: '1px solid #cacaca',
                backgroundColor: 'rgb(244, 244, 244)',
                wordBreak: 'break-all'
              }
            }}

            {{
              style: {
                wordBreak: 'break-word'
              }
            }}

            {sample.result}

          </div>

        </div>

        { when(i.lt(ctrl.samples.length - 1),<hr style={{width: '90%'}}/>) }

      </jsx>

    )
  }

</jsx>
