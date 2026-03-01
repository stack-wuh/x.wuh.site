import * as React from 'react'
import Affix from '@/components/affix'
import Modal from '@/components/modal'
import ModalList from '@/components/banner/gallery'
import Button from '@wuh.site/components/button'

const Gallery = () => {
  const [visible, setvisible] = React.useState(false)

  return (
    <>
      <Modal
        title="故乡山川"
        visible={visible}
        innerStyle={{ padding: 0 }}
        onCancel={() => setvisible(false)}
        footer={false}>
        <ModalList data={[1, 2, 3, 4]} onClose={() => setvisible(false)} />
      </Modal>
      <Affix offsetY={'70vh'}>
        <Button variant='filled' color='primary' onClick={() => setvisible(true)}>
          故乡山川
        </Button>
      </Affix>
    </>
  )
}

export default Gallery
